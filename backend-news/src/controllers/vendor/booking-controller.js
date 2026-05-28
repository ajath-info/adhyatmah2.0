const Booking = require("../../models/Booking");
const User = require("../../models/User");
const Service = require("../../models/Service");

/*     Get All Bookings by Vendor    */
const getBookingsByVendor = async (req, res) => {
  try {
    const {
      page: pageQuery,
      limit: limitQuery,
      search: searchQuery,
      status: statusQuery,
    } = req.query;

    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;
    const skip = limit * (page - 1);

    let matchQuery = { vendor: req.vendor._id.toString() };

    // Add status filter if provided
    if (statusQuery) {
      matchQuery.status = statusQuery;
    }

    // Add search filter for customer names
    let searchMatch = {};
    if (searchQuery) {
      searchMatch = {
        $or: [
          { "customer.firstName": { $regex: searchQuery, $options: "i" } },
          { "customer.lastName": { $regex: searchQuery, $options: "i" } },
          { "poojaType": { $regex: searchQuery, $options: "i" } },
          { "bookingID": { $regex: searchQuery, $options: "i" } }
        ]
      };
    }

    const totalBookings = await Booking.countDocuments({
      ...matchQuery,
      ...searchMatch,
    });

    const bookings = await Booking.aggregate([
      {
        $match: {
          ...matchQuery,
          ...searchMatch,
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "customer",
          foreignField: "_id",
          as: "customer"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "vendor",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: "$customer"
      },
      {
        $unwind: "$vendor"
      },
      {
        $unwind: "$service"
      },
      {
        $project: {
          _id: 1,
          bookingID: 1,
          poojaType: 1,
          package: 1,
          dateTime: 1,
          duration: 1,
          address: 1,
          pujaSamagri: 1,
          status: 1,
          paymentAmount: 1,
          createdAt: 1,
          customer: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1
          },
          vendor: {
            _id: 1,
            firstName: 1,
            lastName: 1
          },
          service: {
            _id: 1,
            poojaType: 1,
            description: 1,
            price: 1
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        data: bookings,
        total: totalBookings,
        count: Math.ceil(totalBookings / limit),
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit)
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/*     Get One Booking by Vendor    */
const getOneBookingByVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      _id: id,
      vendor: req.vendor._id.toString(),
    })
      .populate('customer', 'firstName lastName email phone')
      .populate('vendor', 'firstName lastName email phone')
      .populate('service', 'poojaType description price duration');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/*     Update Booking Status by Vendor    */
const updateBookingStatusByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "ongoing", "upcoming", "completed", "accept", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      vendor: req.vendor._id.toString(),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // When accepting a booking, set status to "upcoming" so it appears in booking queries
    const finalStatus = status === "accept" ? "upcoming" : status;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status: finalStatus },
      { new: true, runValidators: true }
    )
      .populate('customer', 'firstName lastName email phone')
      .populate('vendor', 'firstName lastName email phone')
      .populate('service', 'poojaType description price duration');

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/*     Get Booking Statistics by Vendor    */
const getBookingStatsByVendor = async (req, res) => {
  try {
    const vendorId = req.vendor._id.toString();

    const stats = await Booking.aggregate([
      {
        $match: { vendor: vendorId }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$paymentAmount" },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalBookings: 0,
      totalRevenue: 0,
      pendingBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBookingsByVendor,
  getOneBookingByVendor,
  updateBookingStatusByVendor,
  getBookingStatsByVendor,
};
