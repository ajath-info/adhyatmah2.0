const Orders = require("../../models/Order");
const Shop = require("../../models/Shop");
const Product = require("../../models/Product");

/**
 * Helper function to calculate commission
 */
const calculateCommission = (amount) => {
  const commissionRate = process.env.COMMISSION / 100 || 0.05; // Default 5%
  const commission = amount * commissionRate;
  const netAmount = amount - commission;
  return {
    grossAmount: amount,
    commission,
    commissionRate,
    netAmount,
  };
};

/**
 * Helper function to get date range
 */
const getDateRange = (period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case "today":
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      };
    case "yesterday":
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return { start: yesterday, end: today };
    case "week":
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { start: weekStart, end: now };
    case "month":
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { start: monthStart, end: nextMonthStart };
    case "year":
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);
      return { start: yearStart, end: nextYearStart };
    default:
      return { start: new Date(0), end: now };
  }
};

/**
 * Get Revenue Summary for Vendor
 * GET /api/vendor/revenue/summary
 */
const getRevenueSummary = async (req, res) => {
  try {
    // Get vendor's shop
    const shop = await Shop.findOne({ vendor: req.vendor._id.toString() });
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    const { period = "month", customStart, customEnd } = req.query;

    // Determine date range
    let dateRange;
    if (customStart && customEnd) {
      dateRange = {
        start: new Date(customStart),
        end: new Date(customEnd),
      };
    } else {
      dateRange = getDateRange(period);
    }

    // Get orders for the specified period
    const orders = await Orders.find({
      "items.shop": shop._id,
      createdAt: { $gte: dateRange.start, $lt: dateRange.end },
    });

    // Calculate totals
    let totalRevenue = 0;
    let totalOrders = 0;
    let deliveredOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0;
    let returnedOrders = 0;
    const orderStatusBreakdown = {};
    const paymentMethodBreakdown = {};

    orders.forEach((order) => {
      totalOrders++;

      // Calculate revenue for this order (only from vendor's items)
      const vendorItems = order.items.filter(
        (item) => item.shop && item.shop.toString() === shop._id.toString()
      );

      const orderRevenue = vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      totalRevenue += orderRevenue;

      // Count by status
      const status = order.status || "pending";
      orderStatusBreakdown[status] = (orderStatusBreakdown[status] || 0) + 1;

      if (status === "delivered") deliveredOrders++;
      else if (status === "pending") pendingOrders++;
      else if (status === "canceled") cancelledOrders++;
      else if (status === "returned") returnedOrders++;

      // Count by payment method
      const paymentMethod = order.paymentMethod || "Unknown";
      paymentMethodBreakdown[paymentMethod] =
        (paymentMethodBreakdown[paymentMethod] || 0) + orderRevenue;
    });

    // Calculate commission and net revenue
    const commissionData = calculateCommission(totalRevenue);

    // Get previous period for comparison
    const previousDateRange = getComparisonPeriod(period, dateRange);
    const previousOrders = await Orders.find({
      "items.shop": shop._id,
      createdAt: { $gte: previousDateRange.start, $lt: previousDateRange.end },
    });

    let previousRevenue = 0;
    previousOrders.forEach((order) => {
      const vendorItems = order.items.filter(
        (item) => item.shop && item.shop.toString() === shop._id.toString()
      );
      previousRevenue += vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    });

    // Calculate growth percentage
    const growthPercentage =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    // Average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          netRevenue: Math.round(commissionData.netAmount * 100) / 100,
          commission: Math.round(commissionData.commission * 100) / 100,
          commissionRate: commissionData.commissionRate * 100,
          totalOrders,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
          growthPercentage: Math.round(growthPercentage * 100) / 100,
          period: period,
          dateRange: {
            start: dateRange.start,
            end: dateRange.end,
          },
        },
        orderStatusBreakdown,
        paymentMethodBreakdown,
        statusBreakdown: {
          delivered: deliveredOrders,
          pending: pendingOrders,
          cancelled: cancelledOrders,
          returned: returnedOrders,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Revenue Analytics for Vendor
 * GET /api/vendor/revenue/analytics
 */
const getRevenueAnalytics = async (req, res) => {
  try {
    const shop = await Shop.findOne({ vendor: req.vendor._id.toString() });
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    const {
      period = "month",
      customStart,
      customEnd,
      groupBy = "day", // day, week, month, year
    } = req.query;

    let dateRange;
    if (customStart && customEnd) {
      dateRange = {
        start: new Date(customStart),
        end: new Date(customEnd),
      };
    } else {
      dateRange = getDateRange(period);
    }

    // Build aggregation pipeline for revenue trends
    const pipeline = [
      {
        $match: {
          "items.shop": shop._id,
          createdAt: { $gte: dateRange.start, $lt: dateRange.end },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $match: {
          "items.shop": shop._id,
        },
      },
      {
        $group: {
          _id: getGroupByDateField(groupBy),
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          orders: { $addToSet: "$_id" },
          totalItems: { $sum: "$items.quantity" },
        },
      },
      {
        $addFields: {
          orderCount: { $size: "$orders" },
          averageOrderValue: { $divide: ["$revenue", { $size: "$orders" }] },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const revenueTrends = await Orders.aggregate(pipeline);

    // Get top performing products
    const topProductsPipeline = [
      {
        $match: {
          "items.shop": shop._id,
          createdAt: { $gte: dateRange.start, $lt: dateRange.end },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $match: {
          "items.shop": shop._id,
        },
      },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.name" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          totalQuantity: { $sum: "$items.quantity" },
          orderCount: { $addToSet: "$_id" },
        },
      },
      {
        $addFields: {
          orderCount: { $size: "$orderCount" },
          averagePrice: { $divide: ["$totalRevenue", "$totalQuantity"] },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 10,
      },
    ];

    const topProducts = await Orders.aggregate(topProductsPipeline);

    // Calculate totals
    const totalRevenue = revenueTrends.reduce(
      (sum, item) => sum + item.revenue,
      0
    );
    const totalOrders = revenueTrends.reduce(
      (sum, item) => sum + item.orderCount,
      0
    );
    const totalItems = revenueTrends.reduce(
      (sum, item) => sum + item.totalItems,
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        trends: revenueTrends.map((item) => ({
          date: item._id,
          revenue: Math.round(item.revenue * 100) / 100,
          orderCount: item.orderCount,
          totalItems: item.totalItems,
          averageOrderValue: Math.round(item.averageOrderValue * 100) / 100,
        })),
        topProducts,
        summary: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          totalItems,
          averageOrderValue:
            totalOrders > 0
              ? Math.round((totalRevenue / totalOrders) * 100) / 100
              : 0,
          period: period,
          groupBy: groupBy,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Revenue by Product for Vendor
 * GET /api/vendor/revenue/products
 */
const getRevenueByProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ vendor: req.vendor._id.toString() });
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    const {
      period = "month",
      customStart,
      customEnd,
      limit = 50,
      page = 1,
    } = req.query;

    let dateRange;
    if (customStart && customEnd) {
      dateRange = {
        start: new Date(customStart),
        end: new Date(customEnd),
      };
    } else {
      dateRange = getDateRange(period);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build aggregation pipeline
    const pipeline = [
      {
        $match: {
          "items.shop": shop._id,
          createdAt: { $gte: dateRange.start, $lt: dateRange.end },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $match: {
          "items.shop": shop._id,
        },
      },
      {
        $group: {
          _id: {
            product: "$items.product",
            productName: "$items.name",
          },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          totalQuantity: { $sum: "$items.quantity" },
          averagePrice: { $avg: "$items.price" },
          orderCount: { $addToSet: "$_id" },
          minPrice: { $min: "$items.price" },
          maxPrice: { $max: "$items.price" },
          firstSale: { $min: "$createdAt" },
          lastSale: { $max: "$createdAt" },
        },
      },
      {
        $addFields: {
          orderCount: { $size: "$orderCount" },
          commissionData: {
            $let: {
              vars: {
                commissionRate: {
                  $divide: [parseFloat(process.env.COMMISSION || 5), 100],
                },
              },
              in: {
                grossAmount: "$totalRevenue",
                commission: {
                  $multiply: ["$totalRevenue", "$$commissionRate"],
                },
                netAmount: {
                  $multiply: [
                    "$totalRevenue",
                    { $subtract: [1, "$$commissionRate"] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
    ];

    const productRevenue = await Orders.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = [...pipeline.slice(0, -3), { $count: "total" }];
    const countResult = await Orders.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    // Calculate totals
    const totalRevenue = productRevenue.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );
    const totalQuantity = productRevenue.reduce(
      (sum, item) => sum + item.totalQuantity,
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        products: productRevenue.map((item) => ({
          productId: item._id.product,
          productName: item._id.productName,
          totalRevenue: Math.round(item.totalRevenue * 100) / 100,
          netRevenue: Math.round(item.commissionData.netAmount * 100) / 100,
          commission: Math.round(item.commissionData.commission * 100) / 100,
          totalQuantity: item.totalQuantity,
          orderCount: item.orderCount,
          averagePrice: Math.round(item.averagePrice * 100) / 100,
          minPrice: Math.round(item.minPrice * 100) / 100,
          maxPrice: Math.round(item.maxPrice * 100) / 100,
          firstSale: item.firstSale,
          lastSale: item.lastSale,
        })),
        summary: {
          totalProducts: productRevenue.length,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalQuantity,
          averageRevenuePerProduct:
            productRevenue.length > 0
              ? Math.round((totalRevenue / productRevenue.length) * 100) / 100
              : 0,
          period: period,
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Export Revenue Data for Vendor
 * GET /api/vendor/revenue/export
 */
const exportRevenueData = async (req, res) => {
  try {
    const shop = await Shop.findOne({ vendor: req.vendor._id.toString() });
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    const {
      period = "month",
      customStart,
      customEnd,
      format = "json", // json, csv
    } = req.query;

    let dateRange;
    if (customStart && customEnd) {
      dateRange = {
        start: new Date(customStart),
        end: new Date(customEnd),
      };
    } else {
      dateRange = getDateRange(period);
    }

    // Get detailed order data for export
    const orders = await Orders.find({
      "items.shop": shop._id,
      createdAt: { $gte: dateRange.start, $lt: dateRange.end },
    }).sort({ createdAt: -1 });

    const exportData = orders.map((order) => {
      const vendorItems = order.items.filter(
        (item) => item.shop && item.shop.toString() === shop._id.toString()
      );

      const orderRevenue = vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const commissionData = calculateCommission(orderRevenue);

      return {
        orderId: order._id,
        orderNo: order.orderNo,
        orderDate: order.createdAt,
        customerName: `${order.user?.firstName || ""} ${
          order.user?.lastName || ""
        }`.trim(),
        customerEmail: order.user?.email,
        totalAmount: Math.round(order.total * 100) / 100,
        vendorRevenue: Math.round(orderRevenue * 100) / 100,
        commission: Math.round(commissionData.commission * 100) / 100,
        netAmount: Math.round(commissionData.netAmount * 100) / 100,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        items: vendorItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: Math.round(item.price * item.quantity * 100) / 100,
        })),
        shipping: order.shipping,
        discount: order.discount || 0,
      };
    });

    if (format === "csv") {
      // Convert to CSV format
      const csvHeader =
        "Order ID,Order No,Date,Customer Name,Customer Email,Total Amount,Vendor Revenue,Commission,Net Amount,Status,Payment Method,Payment Status,Items,Shipping,Discount\n";

      const csvRows = exportData.map((row) => {
        const itemsString = row.items
          .map((item) => `${item.name}(${item.quantity}x${item.price})`)
          .join("; ");
        return [
          row.orderId,
          row.orderNo,
          row.orderDate.toISOString().split("T")[0],
          row.customerName,
          row.customerEmail,
          row.totalAmount,
          row.vendorRevenue,
          row.commission,
          row.netAmount,
          row.status,
          row.paymentMethod,
          row.paymentStatus,
          `"${itemsString}"`,
          row.shipping,
          row.discount,
        ].join(",");
      });

      const csvContent = csvHeader + csvRows.join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="vendor-revenue-${period}-${Date.now()}.csv"`
      );
      return res.status(200).send(csvContent);
    }

    // Default JSON format
    return res.status(200).json({
      success: true,
      data: {
        exportInfo: {
          vendor: shop.name,
          period: period,
          dateRange: {
            start: dateRange.start,
            end: dateRange.end,
          },
          exportDate: new Date(),
          totalOrders: exportData.length,
        },
        orders: exportData,
        summary: {
          totalRevenue: exportData.reduce(
            (sum, order) => sum + order.vendorRevenue,
            0
          ),
          totalCommission: exportData.reduce(
            (sum, order) => sum + order.commission,
            0
          ),
          totalNetAmount: exportData.reduce(
            (sum, order) => sum + order.netAmount,
            0
          ),
        },
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Helper function to get comparison period
 */
const getComparisonPeriod = (period, currentDateRange) => {
  const { start, end } = currentDateRange;
  const duration = end.getTime() - start.getTime();

  return {
    start: new Date(start.getTime() - duration),
    end: start,
  };
};

/**
 * Helper function to get group by date field
 */
const getGroupByDateField = (groupBy) => {
  switch (groupBy) {
    case "hour":
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
        hour: { $hour: "$createdAt" },
      };
    case "day":
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    case "week":
      return {
        year: { $year: "$createdAt" },
        week: { $week: "$createdAt" },
      };
    case "month":
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    case "year":
      return {
        year: { $year: "$createdAt" },
      };
    default:
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
  }
};

module.exports = {
  getRevenueSummary,
  getRevenueAnalytics,
  getRevenueByProduct,
  exportRevenueData,
};
