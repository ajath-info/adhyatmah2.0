const Booking = require("../../models/Booking");
const Service = require("../../models/Service");

const moment = require("moment");
const Shop = require("../../models/Shop");

const calculateExpirationDate = (days) => {
  const now = new Date();
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
};

/*  Get Vendor Analytics */
const getVendorAnalytics = async (req, res) => {
  try {
    const vendorId = req.vendor._id.toString();

    const totalServices = await Service.countDocuments({
      vendor: vendorId,
    });

    const mostBookedServices = await Booking.aggregate([
      {
        $match: {
          vendor: vendorId,
        },
      },
      {
        $group: {
          _id: "$service",
          bookingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      {
        $unwind: "$serviceDetails",
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: "$serviceDetails._id",
          poojaType: "$serviceDetails.poojaType",
          description: "$serviceDetails.description",
          price: "$serviceDetails.price",
          bookingCount: 1,
        },
      },
    ]);

    const startOfDay = moment().startOf("day");
    const endOfDay = moment().endOf("day");
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");

    const getBookingStats = async (prop) => {
      const data = await Booking.aggregate([
        // Match bookings within the provided date range
        {
          $match: {
            createdAt: {
              $gte:
                prop === "month" ? startOfMonth.toDate() : startOfDay.toDate(),
              $lte: prop === "month" ? endOfMonth.toDate() : endOfDay.toDate(),
            },
            vendor: vendorId,
          },
        },
        // Group by vendorId and calculate total earnings for each vendor
        {
          $group: {
            _id: 1,
            totalEarnings: { $sum: "$paymentAmount" },
            totalBookings: { $sum: 1 },
          },
        },
      ]);
      return data;
    };
    const dailyStats = await getBookingStats("day");
    const monthlyStats = await getBookingStats("month");
    // Format the result as an object with vendorId as keys and earnings as values
    let dailyEarningsByVendor = 0;
    let totalBookings = 0;
    let monthlyEarningsByVendor = 0;

    dailyStats.forEach((booking) => {
      dailyEarningsByVendor = booking.totalEarnings;
      totalBookings += booking.totalBookings; // Accumulate the total number of bookings
    });
    monthlyStats.forEach((booking) => {
      monthlyEarningsByVendor = booking.totalEarnings;
    });

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Initialize the booking report array with zeros for each month
    let bookingReport = Array(12).fill(0);

    // Loop through each month and aggregate bookings
    for (let month = 0; month < 12; month++) {
      // Get the start and end date for the current month
      const startDate = moment([currentYear, month, 1])
        .startOf("month")
        .toDate();
      const endDate = moment([currentYear, month, 1]).endOf("month").toDate();

      // Aggregate bookings for the current month
      const bookings = await Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
            vendor: vendorId,
          },
        },
        // Group by vendorId and calculate total bookings for each vendor
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
          },
        },
      ]);

      // If there are bookings for the current month, update the booking report
      if (bookings.length > 0) {
        bookingReport[month] = bookings[0].totalBookings;
      }
    }

    // Get bookings for booking report
    const lastYearDate = calculateExpirationDate(-365).getTime();
    const todayDate = new Date().getTime();
    const bookingsByYears = await Booking.find({
      vendor: vendorId,
      createdAt: { $gt: lastYearDate, $lt: todayDate },
    }).select(["createdAt", "status"]);
    
    const totalPendingBookings = await Booking.countDocuments({
      vendor: vendorId,
      status: "pending",
    });
    res.status(200).json({
      success: true,
      data: {
        mostBookedServices,
        dailyEarning: dailyEarningsByVendor,
        dailyBookings: totalBookings,
        totalServices,
        totalPendingBookings,
        bookingReport,

        bookingsReport: [
          "pending",
          "ongoing",
          "upcoming",
          "completed",
          "cancelled",
        ].map(
          (status) => bookingsByYears.filter((v) => v.status === status).length
        ),
        monthlyEarningsByVendor,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*  Get Vendor Services */
const getVendorServices = async (req, res) => {
  try {
    const { page: pageQuery, limit: limitQuery } = req.query;
    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;
    const skip = limit * (page - 1);
    const vendorId = req.vendor._id.toString();

    const totalServices = await Service.countDocuments({
      vendor: vendorId,
    });

    const services = await Service.find({
      vendor: vendorId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select([
        "poojaType",
        "description",
        "duration",
        "price",
        "vendor",
        "createdAt",
      ]);

    res.status(200).json({
      success: true,
      data: services,
      total: totalServices,
      count: Math.ceil(totalServices / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = {
  getVendorAnalytics,
  getVendorServices,
};
