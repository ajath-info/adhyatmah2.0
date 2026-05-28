const Booking = require("../../models/Booking");
const User = require("../../models/User");
const Service = require("../../models/Service");
const VendorReview = require("../../models/VendorReview");
const Settings = require("../../models/Settings");
const { singleFileUploader } = require("../../utils/uploader-util");
const { VENDOR_SEO_CONTENT } = require("../../data/vendorSeoContent");
const { allServices } = require("../../data/allServices");


function normalizeAddress(address) {
  if (!address) {
    return {
      streetAddress: "Address not provided",
      city: "Unknown",
      state: "Unknown",
      country: "India",
      zip: "",
    };
  }

  if (typeof address === "string") {
    const parts = address
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Handle different address formats
    let streetAddress = "";
    let city = "Unknown";
    let state = "Unknown";
    let country = "India";
    let zip = "";

    if (parts.length >= 1) streetAddress = parts[0];
    if (parts.length >= 2) city = parts[1];
    if (parts.length >= 3) state = parts[2];
    if (parts.length >= 4) country = parts[3];
    if (parts.length >= 5) zip = parts[4];

    return {
      streetAddress: streetAddress || "Address not provided",
      city: city || "Unknown",
      state: state || "Unknown",
      country: country || "India",
      zip: zip || "",
    };
  }

  // Handle object format
  const {
    streetAddress = "",
    city = "",
    state = "",
    country = "",
    zip = "",
  } = address;
  return {
    streetAddress: streetAddress || "Address not provided",
    city: city || "Unknown",
    state: state || "Unknown",
    country: country || "India",
    zip: zip || "",
  };
}

function normalizeSamagri(pujaSamagri) {
  if (Array.isArray(pujaSamagri)) return pujaSamagri.join(", ");
  if (typeof pujaSamagri === "string") return pujaSamagri;
  return "";
}

const createBooking = async (
  req,
  res
) => {
  try {

    // ------------------------------------
    // Auth Validation
    // ------------------------------------
    if (
      !req.user ||
      !req.user._id
    ) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message:
          "Unauthorized: No user data found. Please provide a valid token.",
      });
    }

    const {
      vendorId,
      serviceId,
      poojaType,
      package,
      dateTime,
      duration,
      address,
      pujaSamagri,
      paymentAmount,
      language,
    } = req.body;

    // ------------------------------------
    // Required Fields Validation
    // ------------------------------------
    if (
      !vendorId ||
      !serviceId ||
      !poojaType ||
      !package ||
      !dateTime ||
      !duration ||
      !address ||
      !paymentAmount
    ) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message:
          "Missing required fields",
      });
    }

    // ------------------------------------
    // Validate Languages
    // ------------------------------------
    const validLanguages = [
      "hindi",
      "english",
      "marathi",
      "sanskrit",
      "bangali",
      "gujarati",
      "odia",
      "tamil",
      "telugu",
      "kannada",
      "malayalam",
      "others",
    ];

    if (
      language &&
      Array.isArray(language)
    ) {

      const invalidLanguages =
        language.filter(
          (lang) =>
            !validLanguages.includes(
              lang
            )
        );

      if (
        invalidLanguages.length > 0
      ) {
        return res.status(400).json({
          error: true,
          code: 400,
          status: 0,
          message:
            `Invalid languages: ${invalidLanguages.join(
              ", "
            )}`,
        });
      }
    }

    // ------------------------------------
    // Validate Vendor
    // ------------------------------------
    const vendor =
      await User.findById(
        vendorId
      );

    if (
      !vendor ||
      vendor.role !== "vendor"
    ) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message:
          "Invalid vendor ID",
      });
    }

    // ------------------------------------
    // Validate Service
    // ------------------------------------
    const service =
      await Service.findById(
        serviceId
      );

    if (!service) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message:
          "Invalid service ID",
      });
    }

    // ------------------------------------
    // Validate Customer
    // ------------------------------------
    const customer =
      await User.findById(
        req.user._id
      );

    if (!customer) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message:
          "Customer not found",
      });
    }

    // ------------------------------------
    // Normalize Address
    // ------------------------------------
    const normalizedAddress =
      normalizeAddress(address);

    // ------------------------------------
    // Normalize Puja Samagri
    // ------------------------------------
    const normalizedSamagri = {

      pujaKit:
        Array.isArray(
          pujaSamagri?.pujaKit
        )
          ? pujaSamagri.pujaKit
          : [],

      instantKit:
        Array.isArray(
          pujaSamagri?.instantKit
        )
          ? pujaSamagri.instantKit
          : [],
    };

    // ------------------------------------
    // Create Booking
    // ------------------------------------
    const booking =
      await Booking.create({

        customer:
          req.user._id,

        vendor:
          vendorId,

        service:
          serviceId,

        poojaType,

        package,

        dateTime:
          new Date(dateTime),

        duration,

        address:
          normalizedAddress,

        pujaSamagri:
          normalizedSamagri,

        language:
          language || ["hindi"],

        paymentAmount,

        bookingID:
          `BOOK-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`,

        status: "pending",
      });

    // ------------------------------------
    // Populate Booking
    // ------------------------------------
    const populatedBooking =
      await Booking.findById(
        booking._id
      )

        .populate(
          "customer",
          "firstName lastName email"
        )

        .populate(
          "vendor",
          "firstName lastName"
        )

        .populate(
          "service",
          "poojaType"
        )

        .populate(
          "pujaSamagri.pujaKit",
          "name slug price images"
        )

        .populate(
          "pujaSamagri.instantKit",
          "name slug price images"
        );

    // ------------------------------------
    // Response
    // ------------------------------------
    res.status(201).json({
      error: false,

      code: 201,

      status: 1,

      message:
        "Booking created successfully",

      payload: {

        booking: {

          id:
            booking._id,

          bookingID:
            booking.bookingID,

          poojaType:
            booking.poojaType,

          package:
            booking.package,

          dateTime:
            booking.dateTime.toISOString(),

          duration:
            booking.duration,

          address:
            booking.address,

          pujaSamagri:
            populatedBooking.pujaSamagri,

          language:
            booking.language,

          status:
            booking.status,

          paymentAmount:
            booking.paymentAmount,

          service:
            populatedBooking.service
              ? {
                  id:
                    service._id,

                  poojaType:
                    populatedBooking
                      .service
                      .poojaType,
                }
              : null,

          customer: {
            id:
              populatedBooking
                .customer._id,

            firstName:
              populatedBooking
                .customer
                .firstName,

            lastName:
              populatedBooking
                .customer
                .lastName,

            email:
              populatedBooking
                .customer
                .email,
          },

          vendor: {
            id:
              populatedBooking
                .vendor._id,

            firstName:
              populatedBooking
                .vendor
                .firstName,

            lastName:
              populatedBooking
                .vendor
                .lastName,
          },
        },
      },
    });

  } catch (error) {

    console.error(
      "Error in createBooking:",
      error
    );

    res.status(500).json({
      error: true,

      code: 500,

      status: 0,

      message:
        "Failed to create booking: " +
        error.message,
    });
  }
};


const getBookings = async (req, res) => {
  try {
    const userId = req.user && req.user._id ? req.user._id.toString() : null;
    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized",
      });
    }

    // Ensure role even if token lacks it
    const authedUser = await User.findById(userId).select("role");
    const role = authedUser?.role || req.user.role;

    const { type } = req.query; // previous | ongoing | upcoming | pending (optional)
    const now = new Date();

    const ownerField =
      role === "vendor" ? { vendor: userId } : { customer: userId };

    if (type === "ongoing") {
      // Get all bookings that could potentially be ongoing
      const potentialOngoing = await Booking.find({
        ...ownerField,
        status: { $in: ["pending", "upcoming", "ongoing", "accept"] },
        dateTime: { $lte: now }, // Started already
      })
        .populate("customer", "firstName lastName email phone image")
        .populate("vendor", "firstName lastName email phone image")
        .sort({ dateTime: 1 });

      // Filter bookings that are actually ongoing (within their time window)
      const ongoing = potentialOngoing.filter((booking) => {
        const startTime = new Date(booking.dateTime);
        const durationMinutes = parseDuration(booking.duration);
        const endTime = new Date(
          startTime.getTime() + durationMinutes * 60 * 1000
        );

        // Booking is ongoing if current time is between start and end time
        return now >= startTime && now <= endTime;
      });

      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Ongoing bookings fetched successfully",
        payload: { bookings: ongoing },
      });
    }

    if (type === "upcoming") {
      const upcoming = await Booking.find({
        ...ownerField,
        status: { $in: ["upcoming", "accept"] },
        dateTime: { $gte: now },
      })
        .populate("customer", "firstName lastName email phone image")
        .populate("vendor", "firstName lastName email phone image")
        .sort({ dateTime: 1 });

      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Upcoming bookings fetched successfully",
        payload: { bookings: upcoming },
      });
    }

    if (type === "pending") {
      const pending = await Booking.find({
        ...ownerField,
        status: "pending",
        dateTime: { $gte: now },
      })
        .populate("customer", "firstName lastName email phone image")
        .populate("vendor", "firstName lastName email phone image")
        .sort({ dateTime: 1 });

      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Pending bookings fetched successfully",
        payload: { bookings: pending },
      });
    }

    if (type === "previous") {
      const previous = await Booking.find({
        ...ownerField,
        status: "completed",
      })
        .populate("customer", "firstName lastName email phone image")
        .populate("vendor", "firstName lastName email phone image")
        .sort({ dateTime: -1 });

      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Previous bookings fetched successfully",
        payload: { bookings: previous },
      });
    }
    if (type === "cancelled") {
      const cancelled = await Booking.find({
        ...ownerField,
        status: "cancelled",
      })
        .populate("customer", "firstName lastName email phone image")
        .populate("vendor", "firstName lastName email phone image")
        .sort({ dateTime: -1 });

      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Cancelled bookings fetched successfully",
        payload: { bookings: cancelled },
      });
    }
    // Default: segmented response with populated customer data
    // Get all active bookings (not completed or cancelled)
    // Include "accept" status as it should be treated as "upcoming"
    const activeBookings = await Booking.find({
      ...ownerField,
      status: { $in: ["pending", "upcoming", "ongoing", "accept"] },
    })
      .populate("customer", "firstName lastName email phone image")
      .populate("vendor", "firstName lastName email phone image")
      .sort({ dateTime: 1 });

    // Get completed/cancelled bookings
    const previous = await Booking.find({
      ...ownerField,
      status: { $in: ["completed", "cancelled"] },
    })
      .populate("customer", "firstName lastName email phone image")
      .populate("vendor", "firstName lastName email phone image")
      .sort({ dateTime: -1 });

    // Categorize active bookings based on status and time
    const pending = [];
    const upcoming = [];
    const ongoing = [];

    activeBookings.forEach((booking) => {
      const startTime = new Date(booking.dateTime);
      const durationMinutes = parseDuration(booking.duration);
      const endTime = new Date(
        startTime.getTime() + durationMinutes * 60 * 1000
      );

      if (booking.status === "pending") {
        pending.push(booking);
      } else if (booking.status === "upcoming" || booking.status === "accept") {
        // Treat "accept" status as "upcoming" since accepted bookings are upcoming
        upcoming.push(booking);
      } else if (booking.status === "ongoing") {
        // Check if booking is actually ongoing (within time window)
        if (now >= startTime && now <= endTime) {
          ongoing.push(booking);
        } else if (now > endTime) {
          // If booking time has passed, it should be completed
          // This will be handled by updating the status
        } else {
          // If booking hasn't started yet, it should be upcoming
          upcoming.push(booking);
        }
      }
    });

    // Debug information
    console.log(`Booking categorization for user ${userId}:`, {
      totalActiveBookings: activeBookings.length,
      pending: pending.length,
      upcoming: upcoming.length,
      ongoing: ongoing.length,
      previous: previous.length,
      currentTime: now.toISOString(),
    });

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Bookings fetched successfully",
      payload: { ongoing, pending, upcoming, previous },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    if (!bookingId || !status) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "bookingId and status are required",
      });
    }

    // Normalize status (support both "cancelled" and "canceled")
    let normalizedStatus = status;
    if (status === "canceled") {
      normalizedStatus = "cancelled";
    }

    const allowedStatuses = [
      "pending",
      "upcoming",
      "ongoing",
      "accept",
      "completed",
      "cancelled",
    ];
    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid status value",
      });
    }

    const userId = req.user && req.user._id ? req.user._id.toString() : null;
    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized",
      });
    }

    // Load the full user to determine their role (token may not include role)
    const authedUser = await User.findById(userId).select("role");
    const role = authedUser?.role;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Booking not found",
      });
    }

    if (role === "vendor") {
      if (booking.vendor.toString() !== userId) {
        return res.status(403).json({
          error: true,
          code: 403,
          status: 0,
          message: "You can only update your own bookings",
        });
      }
      if (normalizedStatus === "completed") {
        return res.status(403).json({
          error: true,
          code: 403,
          status: 0,
          message: "Only users can complete the booking",
        });
      }
      if (normalizedStatus === "accept") {
        if (booking.status !== "pending") {
          return res.status(400).json({
            error: true,
            code: 400,
            status: 0,
            message: "Can only accept pending bookings",
          });
        }
        // When accepting a booking, set status to "upcoming" so it appears in booking queries
        booking.status = "upcoming";
      } else {
        booking.status = normalizedStatus;
      }
      await booking.save();
    } else if (role === "user") {
      // Users can complete or cancel their own bookings
      if (booking.customer.toString() !== userId) {
        return res.status(403).json({
          error: true,
          code: 403,
          status: 0,
          message: "You can only update your own bookings",
        });
      }
      if (normalizedStatus === "completed") {
        if (booking.status === "cancelled") {
          return res.status(400).json({
            error: true,
            code: 400,
            status: 0,
            message: "Cannot complete a cancelled booking",
          });
        }
        booking.status = "completed";
        await booking.save();
      } else if (normalizedStatus === "cancelled") {
        if (booking.status === "completed") {
          return res.status(400).json({
            error: true,
            code: 400,
            status: 0,
            message: "Cannot cancel a completed booking",
          });
        }
        booking.status = "cancelled";
        await booking.save();
      } else {
        return res.status(403).json({
          error: true,
          code: 403,
          status: 0,
          message: "Users can only complete or cancel bookings",
        });
      }
    } else {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "Forbidden",
      });
    }

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Booking status updated successfully",
      payload: {
        booking,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

const createService = async (req, res) => {
  try {
    const { poojaType, description, duration, price } = req.body;
    const vendorId = req.user._id.toString();

    if (!vendorId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Authentication required",
      });
    }

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "Only vendors can create services",
      });
    }

    const existingService = await Service.findOne({
      poojaType,
      vendor: vendorId,
    });
    if (existingService) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Service already exists in profile",
      });
    }

    const service = await Service.create({
      poojaType,
      description,
      duration,
      price,
      vendor: vendorId,
    });

    vendor.services.push(service._id);
    await vendor.save();

    res.status(201).json({
      error: false,
      code: 201,
      status: 1,
      message: "Service created successfully",
      payload: {
        service: {
          id: service._id,
          poojaType: service.poojaType,
          description: service.description,
          duration: service.duration,
          price: service.price,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    // Get panditId from query parameters
    const { panditId } = req.query;

    // Get user info from token (for all roles: user, vendor, admin)
    const userId = req.user._id.toString();

    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Authentication required",
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Check if user has valid role (user, vendor, admin)
    const validRoles = ["user", "vendor", "admin", "super-admin"];
    if (!validRoles.includes(user.role)) {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "Access denied. Invalid user role",
      });
    }

    let services;

    if (panditId) {
      // If panditId is provided, fetch services for that specific pandit/vendor
      // Validate panditId format
      if (panditId.length !== 24) {
        return res.status(400).json({
          error: true,
          code: 400,
          status: 0,
          message: "Invalid pandit ID format",
        });
      }

      // Check if the pandit exists and is a vendor
      const pandit = await User.findById(panditId);
      if (!pandit) {
        return res.status(404).json({
          error: true,
          code: 404,
          status: 0,
          message: "Pandit not found",
        });
      }

      if (pandit.role !== "vendor") {
        return res.status(400).json({
          error: true,
          code: 400,
          status: 0,
          message: "The specified ID does not belong to a pandit/vendor",
        });
      }

      // Fetch services for the specific pandit
      services = await Service.find({ vendor: panditId }).select(
        "poojaType description duration price vendor"
      );
    } else {
      // If no panditId provided, fetch all services (for admin) or user's own services (for vendor)
      if (user.role === "vendor") {
        // Vendor can only see their own services
        services = await Service.find({ vendor: userId }).select(
          "poojaType description duration price vendor"
        );
      } else if (["admin", "super-admin"].includes(user.role)) {
        // Admin can see all services
        services = await Service.find({}).select(
          "poojaType description duration price vendor"
        );
      } else {
        // Regular users can see all services (public view)
        services = await Service.find({}).select(
          "poojaType description duration price vendor"
        );
      }
    }

    // Populate vendor information for better response
    const servicesWithVendor = await Service.find(
      panditId
        ? { vendor: panditId }
        : user.role === "vendor"
        ? { vendor: userId }
        : {}
    )
      .select("poojaType description duration price vendor")
      .populate("vendor", "firstName lastName email phone role");

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: panditId
        ? "Pandit services fetched successfully"
        : "Services fetched successfully",
      payload: {
        services: servicesWithVendor.map((service) => ({
          id: service._id,
          poojaType: service.poojaType,
          description: service.description,
          duration: service.duration,
          price: service.price,
          gst: 18,
          advance: 25,
          vendor: {
            id: service.vendor._id,
            firstName: service.vendor.firstName,
            lastName: service.vendor.lastName,
            email: service.vendor.email,
            phone: service.vendor.phone,
            role: service.vendor.role,
          },
        })),
        totalServices: servicesWithVendor.length,
        panditId: panditId || null,
      },
    });
  } catch (error) {
    console.error("Error in getAllServices:", error);
    res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch services: " + error.message,
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const vendorId = req.user._id.toString();

    if (!vendorId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Authentication required",
      });
    }

    const service = await Service.findOne({
      _id: serviceId,
      vendor: vendorId,
    }).select("poojaType description duration price");

    if (!service) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Service not found or not owned by you",
      });
    }

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Service details fetched successfully",
      payload: {
        service: {
          id: service._id,
          poojaType: service.poojaType,
          description: service.description,
          duration: service.duration,
          price: service.price,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

/*const getPanditProfile = async (req, res) => {
  try {
    const vendorId = req.query.vendorId;

    const vendor = await User.findById(vendorId)
      .select(
        "firstName lastName email gender language phone about cover address city zip country state experience role services gotra veda pankti shakha sutra pravar aadhar dateOfBirth"
      )
      .populate({
        path: "services",
        select: "poojaType description duration price",
      });

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Vendor not found",
      });
    }

    // Log for debugging
    console.log("Vendor ID:", vendorId);
    console.log("Vendor cover:", vendor.cover);

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Vendor profile fetched successfully",
      payload: {
        vendor: {
          id: vendor._id,
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          email: vendor.email,
          gender: vendor.gender,
          language: vendor.language,
          phone: vendor.phone,
          about: vendor.about,
          role: vendor.role,
          services: Array.isArray(vendor.services)
            ? vendor.services.map((service) => ({
                id: service._id,
                poojaType: service.poojaType,
                description: service.description,
                duration: service.duration,
                price: service.price,
              }))
            : [],
          image:
            vendor.cover && vendor.cover.url
              ? {
                  _id: vendor.cover._id || null,
                  url: vendor.cover.url,
                }
              : null,
          aadhar: vendor.aadhar || null,
          gotra: vendor.gotra,
          veda: vendor.veda,
          pankti: vendor.pankti,
          shakha: vendor.shakha,
          sutra: vendor.sutra,
          pravar: vendor.pravar,
          dateOfBirth: vendor.dateOfBirth || null,
          address: {
            street: vendor.address || null,
            city: vendor.city || null,
            state: vendor.state || null,
            zip: vendor.zip || null,
            country: vendor.country || null,
          },
          experience: vendor.experience || 2,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};*/

const getPanditProfile = async (req, res) => {
  try {
    const vendorId = req.query.vendorId;

    const vendor = await User.findById(vendorId)
      .select(
        "firstName lastName email image gender language phone about cover address city zip country state experience role services gotra veda pankti shakha sutra pravar aadhar dateOfBirth experience"
      )
      .populate({
        path: "services",
        select: "poojaType description duration price",
      });

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Vendor not found",
      });
    }

    // Log for debugging
    console.log("Vendor ID:", vendorId);
    console.log("Vendor cover:", vendor.cover);

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Vendor profile fetched successfully",
      payload: {
        vendor: {
          id: vendor._id,
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          email: vendor.email,
		  image: vendor.image,
          gender: vendor.gender,
          language: vendor.language,
          phone: vendor.phone,
          about: vendor.about,
          role: vendor.role,
          services: Array.isArray(vendor.services)
            ? vendor.services.map((service) => ({
                id: service._id,
                poojaType: service.poojaType,
                description: service.description,
                duration: service.duration,
                price: service.price,
              }))
            : [],
          image: (vendor.cover && vendor.cover.url) ? {
            _id: vendor.cover._id || null,
            url: vendor.cover.url
          } : null,
          aadhar: vendor.aadhar || null,
          gotra: vendor.gotra || null,
          veda: vendor.veda || null,
          pankti: vendor.pankti || null,
          shakha: vendor.shakha || null,
          sutra: vendor.sutra || null,
          pravar: vendor.pravar || null,
          dateOfBirth: vendor.dateOfBirth || null,
          address: {
            street: vendor.address || null,
            city: vendor.city || null,
            state: vendor.state || null,
            zip: vendor.zip || null,
            country: vendor.country || null,
          },
          experience: vendor.experience || '1',
        },
      },
    });
  } catch (error) {
    console.error("Error in getPanditProfile:", error);
    res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch vendor profile: " + error.message,
    });
  }
};


const getPanditList = async (req, res) => {
  try {
    const { name, serviceName, slug } =
      req.query;
    let query = {
      role: "vendor",
    };
    if (name) {
      query.$or = [
        {
          firstName: {
            $regex: name,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: name,
            $options: "i",
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: [
                  "$firstName",
                  " ",
                  "$lastName",
                ],
              },
              regex: name,
              options: "i",
            },
          },
        },
      ];
    }
    let vendors = await User.find(query)
      .select(
        "firstName lastName email phone about services cover address city country state zip language gotra experience"
      )
      .populate({
        path: "services",
        select:
          "poojaType description duration price",
        match: serviceName
          ? {
              poojaType: {
                $regex: serviceName,
                $options: "i",
              },
            }
          : {},
      });
	  
    if (serviceName) {
      vendors = vendors.filter(
        (vendor) =>
          vendor.services &&
          vendor.services.length > 0
      );
    }
    let formattedVendors =
      vendors.map((vendor) => {

		  const vendorSlug =
          `${vendor.firstName || ""} ${vendor.lastName || ""}`
            .toLowerCase()
            .replace(/\s+/g, "-")
            .trim();

		  const randomViews =
          Math.floor(
            Math.random() *
              (5000 - 500 + 1)
          ) + 500;

        return {
          id: vendor._id.toString(),
          firstName:
            vendor.firstName,
          lastName:
            vendor.lastName,
          slug: vendorSlug,
          email: vendor.email,
          phone: vendor.phone,
          verified: true,
          trusted: true,
          about:
            vendor.about ?? null,
          totalServices:
            (vendor.services?.length || 0) +
            " Types of Pooja",
          views: randomViews,
          services: vendor.services
		  ? vendor.services.map(
			  (service) => {
				// match service image
				const matchedService =
				  allServices.find(
					(item) =>
					  item.name
						.toLowerCase()
						.trim() ===
					  service.poojaType
						?.toLowerCase()
						.trim()
				  );
				return {
				  id:
					service._id.toString(),
				  poojaType:
					service.poojaType,
				  description:
					service.description,
				  duration:
					service.duration,
				  price:
					service.price,
				  originalPrice:
            		matchedService?.originalPrice ||
            		null,
				  image:
					matchedService?.image
					  ?.url || null,
				};
			  }
			)
		  : [],
          image:
            vendor.cover ?? null,
          address:
            vendor.address ?? null,
          city:
            vendor.city ?? null,
          country:
            vendor.country ?? null,
          state:
            vendor.state ?? null,
          zip:
            vendor.zip ?? null,
          language:
            vendor.language ??
            null,
          gotra:
            vendor.gotra ?? null,
          experience:
            vendor.experience ??
            null,
		  seoContent:
    		VENDOR_SEO_CONTENT[vendorSlug] || null,
        };
      });
    if (slug) {
      formattedVendors =
        formattedVendors.filter(
          (vendor) =>
            vendor.slug === slug
        );
    }
    if (
      formattedVendors.length === 0
    ) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message:
          "Vendor not found",
      });
    }
    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message:
        "Vendors list fetched successfully",
      payload: {
        vendors:
          formattedVendors,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message:
        "Failed to fetch vendors: " +
        error.message,
    });
  }
};

// Get available time slots for a pandit on a specific date
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { vendorId, date } = req.query;

    if (!vendorId || !date) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Vendor ID and date are required",
      });
    }

    // Check if vendor exists
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Vendor not found",
      });
    }

    // Get existing bookings for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      vendor: vendorId,
      dateTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $nin: ["cancel", "completed"] },
    });

    // Generate available time slots (9 AM to 8 PM, 2-hour slots)
    const availableSlots = [];
    const bookedSlots = existingBookings.map((booking) => {
      const bookingTime = new Date(booking.dateTime);
      return bookingTime.getHours();
    });

    for (let hour = 9; hour <= 18; hour += 2) {
      if (!bookedSlots.includes(hour)) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 2, 0, 0, 0);

        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          displayTime: `${hour}:00 - ${hour + 2}:00`,
          available: true,
        });
      }
    }

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Available time slots fetched successfully",
      payload: {
        vendorId,
        date,
        availableSlots,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// Get all pandit available services (public API)
const getAllPanditServices = async (req, res) => {
  try {
    const services = await Service.find({})
      .populate({
        path: "vendor",
        select:
          "firstName lastName email phone role cover about experience language gotra veda pankti shakha sutra address city state country zip",
        match: { role: "vendor" },
      })
      .sort({ createdAt: -1 });

    // vendor null wale hata do
    const validServices = services.filter(
      (service) => service.vendor && service.vendor.role === "vendor"
    );

    // 🔥 GROUP BY poojaType (without changing structure)
    const uniquePoojaTypeMap = new Map();

    validServices.forEach((service) => {
      if (!uniquePoojaTypeMap.has(service.poojaType)) {
        uniquePoojaTypeMap.set(service.poojaType, service);
      }
    });

    const uniqueServices = Array.from(uniquePoojaTypeMap.values());

    // Same response formatting
    const formattedServices = uniqueServices.map((service) => ({
      id: service._id,
      poojaType: service.poojaType,
      description: service.description,
      duration: service.duration,
      price: service.price,
      vendor: {
        id: service.vendor._id,
        firstName: service.vendor.firstName,
        lastName: service.vendor.lastName,
        email: service.vendor.email,
        phone: service.vendor.phone,
        about: service.vendor.about,
        image: (service.vendor.cover && service.vendor.cover.url) ? {
          _id: service.vendor.cover._id || null,
          url: service.vendor.cover.url
        } : null,
        experience: service.vendor.experience || null,
        language: service.vendor.language || [],
        gotra: service.vendor.gotra || null,
        veda: service.vendor.veda || null,
        pankti: service.vendor.pankti || null,
        shakha: service.vendor.shakha || null,
        sutra: service.vendor.sutra || null,
        address: {
          street: service.vendor.address || null,
          city: service.vendor.city || null,
          state: service.vendor.state || null,
          zip: service.vendor.zip || null,
          country: service.vendor.country || null,
        },
      },
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "All pandit services fetched successfully",
      payload: {
        services: formattedServices,
        totalServices: formattedServices.length,
      },
    });
  } catch (error) {
    console.error("Error in getAllPanditServices:", error);
    res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch pandit services: " + error.message,
    });
  }
};

// Get pandit services with detailed pricing
const getPanditServices = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Vendor ID is required",
      });
    }

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Vendor not found",
      });
    }

    const services = await Service.find({ vendor: vendorId });

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Pandit services fetched successfully",
      payload: {
        vendor: {
          id: vendor._id,
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          phone: vendor.phone,
          about: vendor.about,
          image: vendor.cover,
          experience: vendor.experience,
          language: vendor.language,
		  gotra: vendor.gotra,
        },
        services: services.map((service) => ({
          id: service._id,
          poojaType: service.poojaType,
          description: service.description,
          duration: service.duration,
          price: service.price,
          createdAt: service.createdAt,
        })),
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// Check pandit availability for a specific date and time
const checkPanditAvailability = async (req, res) => {
  try {
    const { vendorId, dateTime } = req.body;

    if (!vendorId || !dateTime) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Vendor ID and date/time are required",
      });
    }

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Vendor not found",
      });
    }

    const requestedDateTime = new Date(dateTime);
    const startTime = new Date(requestedDateTime);
    startTime.setMinutes(0, 0, 0);
    const endTime = new Date(requestedDateTime);
    endTime.setHours(endTime.getHours() + 2, 0, 0, 0);

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      vendor: vendorId,
      dateTime: {
        $gte: startTime,
        $lt: endTime,
      },
      status: { $nin: ["cancel", "completed"] },
    });

    const isAvailable = !conflictingBooking;

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: isAvailable ? "Pandit is available" : "Pandit is not available",
      payload: {
        vendorId,
        requestedDateTime,
        isAvailable,
        conflictingBooking: conflictingBooking
          ? {
              id: conflictingBooking._id,
              bookingID: conflictingBooking.bookingID,
              status: conflictingBooking.status,
            }
          : null,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// Get booking details by ID
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.query;
    const userId = req.user._id.toString();

    const booking = await Booking.findById(bookingId)
      .populate("customer", "firstName lastName email phone")
      .populate(
        "vendor",
        "firstName lastName email phone about image experience language gotra"
      );

    if (!booking) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Booking not found",
      });
    }

    // Check if user has access to this booking
    if (
      booking.customer._id.toString() !== userId &&
      booking.vendor._id.toString() !== userId
    ) {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "Access denied",
      });
    }

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Booking details fetched successfully",
      payload: {
        booking: {
          id: booking._id,
          bookingID: booking.bookingID,
          poojaType: booking.poojaType,
          package: booking.package,
          dateTime: booking.dateTime,
          duration: booking.duration,
          address: booking.address,
          pujaSamagri: booking.pujaSamagri,
          status: booking.status,
          paymentAmount: booking.paymentAmount,
          customer: {
            id: booking.customer._id,
            firstName: booking.customer.firstName,
            lastName: booking.customer.lastName,
            email: booking.customer.email,
            phone: booking.customer.phone,
          },
          vendor: {
            id: booking.vendor._id,
            firstName: booking.vendor.firstName,
            lastName: booking.vendor.lastName,
            email: booking.vendor.email,
            phone: booking.vendor.phone,
            about: booking.vendor.about,
            image: booking.vendor.image,
            experience: booking.vendor.experience,
            language: booking.vendor.language,
			gotra: booking.gotra,
          },
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.query;
    const userId = req.user._id.toString();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Booking not found",
      });
    }

    // Check if user has permission to cancel
    if (
      booking.customer.toString() !== userId &&
      booking.vendor.toString() !== userId
    ) {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "Access denied",
      });
    }

    // Check if booking can be cancel
    if (booking.status === "cancel") {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Booking is already cancel",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Cannot cancel completed booking",
      });
    }

    booking.status = "cancel";
    await booking.save();

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Booking cancel successfully",
      payload: {
        booking: {
          id: booking._id,
          bookingID: booking.bookingID,
          status: booking.status,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// Get booking statistics for vendor
const getBookingStats = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const role = req.user.role;

    if (role !== "vendor") {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "Only vendors can access booking statistics",
      });
    }

    const totalBookings = await Booking.countDocuments({ vendor: userId });
    const pendingBookings = await Booking.countDocuments({
      vendor: userId,
      status: "pending",
    });
    const upcomingBookings = await Booking.countDocuments({
      vendor: userId,
      status: "upcoming",
    });
    const completedBookings = await Booking.countDocuments({
      vendor: userId,
      status: "completed",
    });
    const cancelledBookings = await Booking.countDocuments({
      vendor: userId,
      status: "cancel",
    });

    // Calculate total earnings
    const earningsResult = await Booking.aggregate([
      { $match: { vendor: userId, status: "completed" } },
      { $group: { _id: null, totalEarnings: { $sum: "$paymentAmount" } } },
    ]);

    const totalEarnings =
      earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Booking statistics fetched successfully",
      payload: {
        stats: {
          totalBookings,
          pendingBookings,
          upcomingBookings,
          completedBookings,
          cancelledBookings,
          totalEarnings,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// Vendor booking history segmented
// Helper function to parse duration string and calculate end time
const parseDuration = (durationStr) => {
  const match = durationStr.match(/(\d+)\s*(hour|hours|hr|hrs)/i);
  if (match) {
    return parseInt(match[1]) * 60; // Convert to minutes
  }
  return 120; // Default to 2 hours if parsing fails
};

const getVendorBookingHistory = async (req, res) => {
  try {
    const userId = req.user && req.user._id ? req.user._id.toString() : null;
    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized",
      });
    }

    // Load role from DB to avoid missing role in token
    const authedUser = await User.findById(userId).select("role");
    const role = authedUser?.role;

    if (role !== "vendor") {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "Only vendors can access booking history",
      });
    }

    const now = new Date();
    const { type } = req.query; // optional: previous | ongoing | upcoming

    if (type === "ongoing") {
      // Get all bookings that could potentially be ongoing
      const potentialOngoing = await Booking.find({
        vendor: userId,
        status: { $in: ["pending", "upcoming", "ongoing", "accept"] },
        dateTime: { $lte: now }, // Started already
      })
        .populate({
          path: "customer",
          select: "firstName lastName email phone image",
        })
        .sort({ dateTime: 1 });

      // Ensure all customers have image field (even if null)
      potentialOngoing.forEach((booking) => {
        if (booking.customer && booking.customer.image === undefined) {
          booking.customer.image = null;
        }
      });

      // Filter bookings that are actually ongoing (within their time window)
      const ongoing = potentialOngoing.filter((booking) => {
        const startTime = new Date(booking.dateTime);
        const durationMinutes = parseDuration(booking.duration);
        const endTime = new Date(
          startTime.getTime() + durationMinutes * 60 * 1000
        );

        // Booking is ongoing if current time is between start and end time
        return now >= startTime && now <= endTime;
      });

      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Ongoing bookings fetched successfully",
        payload: {
          // bookings: [{
          // ongoing: ongoing,
          // pending: [],
          // upcoming: [],
          // previous: [],
          //cancelled: []
          // }]
          bookings: ongoing,
        },
      });
    }

    if (type === "upcoming") {
      const upcoming = await Booking.find({
        vendor: userId,
        status: { $in: ["upcoming", "accept"] },
        dateTime: { $gte: now },
      })
        .populate({
          path: "customer",
          select: "firstName lastName email phone image",
        })
        .sort({ dateTime: 1 });

      // Ensure all customers have image field (even if null)
      upcoming.forEach((booking) => {
        if (booking.customer && booking.customer.image === undefined) {
          booking.customer.image = null;
        }
      });
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Upcoming bookings fetched successfully",
        payload: {
          // bookings: [{
          // ongoing: [],
          // pending: [],
          // upcoming: upcoming,
          // previous: [],
          // cancelled: []
          // }]
          bookings: upcoming,
        },
      });
    }

    if (type === "pending") {
      const pending = await Booking.find({
        vendor: userId,
        status: "pending",
        dateTime: { $gte: now },
      })
        .populate({
          path: "customer",
          select: "firstName lastName email phone image",
        })
        .sort({ dateTime: 1 });

      // Ensure all customers have image field (even if null)
      pending.forEach((booking) => {
        if (booking.customer && booking.customer.image === undefined) {
          booking.customer.image = null;
        }
      });
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Pending bookings fetched successfully",
        payload: {
          // bookings: [{
          // ongoing: [],
          // pending: pending,
          // upcoming: [],
          // previous: [],
          // cancelled: []
          // }]
          bookings: pending,
        },
      });
    }

    if (type === "previous") {
      const previous = await Booking.find({
        vendor: userId,
        status: { $in: ["completed", "cancelled"] },
      })
        .populate({
          path: "customer",
          select: "firstName lastName email phone image",
        })
        .sort({ dateTime: -1 });

      // Ensure all customers have image field (even if null)
      previous.forEach((booking) => {
        if (booking.customer && booking.customer.image === undefined) {
          booking.customer.image = null;
        }
      });
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Previous bookings fetched successfully",
        payload: {
          // bookings: [{
          // ongoing: [],
          // pending: [],
          // upcoming: [],
          // previous: previous,
          // cancelled: []
          // }]
          bookings: previous,
        },
      });
    }

    if (type === "cancelled" || type === "canceled") {
      const cancelled = await Booking.find({
        vendor: userId,
        status: "cancelled",
      })
        .populate({
          path: "customer",
          select: "firstName lastName email phone image",
        })
        .sort({ dateTime: -1 });

      // Ensure all customers have image field (even if null)
      cancelled.forEach((booking) => {
        if (booking.customer && booking.customer.image === undefined) {
          booking.customer.image = null;
        }
      });
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Cancelled bookings fetched successfully",
        payload: {
          // bookings: [{
          // ongoing: [],
          // pending: [],
          // upcoming: [],
          // previous: [],
          // cancelled: cancelled
          // }]
          bookings: cancelled,
        },
      });
    }

    // Default: segmented response with populated customer data
    // Get all active bookings (not completed or cancelled)
    // Include "accept" status as it should be treated as "upcoming"
    const activeBookings = await Booking.find({
      vendor: userId,
      status: { $in: ["pending", "upcoming", "ongoing", "accept"] },
    })
      .populate({
        path: "customer",
        select: "firstName lastName email phone image",
      })
      .sort({ dateTime: 1 });

    // Get completed bookings (previous)
    const previous = await Booking.find({
      vendor: userId,
      status: "completed",
    })
      .populate({
        path: "customer",
        select: "firstName lastName email phone image",
      })
      .sort({ dateTime: -1 });

    // Get cancelled bookings separately
    const cancelled = await Booking.find({
      vendor: userId,
      status: "cancelled",
    })
      .populate({
        path: "customer",
        select: "firstName lastName email phone image",
      })
      .sort({ dateTime: -1 });

    // Categorize active bookings based on status and time
    const pending = [];
    const upcoming = [];
    const ongoing = [];

    activeBookings.forEach((booking) => {
      const startTime = new Date(booking.dateTime);
      const durationMinutes = parseDuration(booking.duration);
      const endTime = new Date(
        startTime.getTime() + durationMinutes * 60 * 1000
      );

      if (booking.status === "pending") {
        pending.push(booking);
      } else if (booking.status === "upcoming" || booking.status === "accept") {
        // Treat "accept" status as "upcoming" since accepted bookings are upcoming
        upcoming.push(booking);
      } else if (booking.status === "ongoing") {
        // Check if booking is actually ongoing (within time window)
        if (now >= startTime && now <= endTime) {
          ongoing.push(booking);
        } else if (now > endTime) {
          // If booking time has passed, it should be completed
          // This will be handled by updating the status
        } else {
          // If booking hasn't started yet, it should be upcoming
          upcoming.push(booking);
        }
      }
    });

    // Ensure all customers have image field (even if null)
    activeBookings.forEach((booking) => {
      if (booking.customer && booking.customer.image === undefined) {
        booking.customer.image = null;
      }
    });

    previous.forEach((booking) => {
      if (booking.customer && booking.customer.image === undefined) {
        booking.customer.image = null;
      }
    });

    cancelled.forEach((booking) => {
      if (booking.customer && booking.customer.image === undefined) {
        booking.customer.image = null;
      }
    });

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Vendor booking history fetched successfully",
      payload: {
        bookings: [
          {
            ongoing: ongoing,
            pending: pending,
            upcoming: upcoming,
            previous: previous,
            cancelled: cancelled,
          },
        ],
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// Create a review for a vendor based on a completed booking
const createVendorReview = async (req, res) => {
  try {
    const customerId = req.user._id.toString();
    const { bookingId, rating, review, images = [] } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Booking not found",
      });
    }

    if (booking.customer.toString() !== customerId) {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "You can only review your own bookings",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Only completed bookings can be reviewed",
      });
    }

    const existing = await VendorReview.findOne({ booking: bookingId });
    if (existing) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "You have already reviewed this booking",
      });
    }

    const doc = await VendorReview.create({
      vendor: booking.vendor,
      customer: booking.customer,
      booking: booking._id,
      rating,
      review,
      images,
    });

    res.status(201).json({
      error: false,
      code: 201,
      status: 1,
      message: "Review submitted successfully",
      payload: {
        review: doc,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// List reviews for a vendor with average rating
const getVendorReviews = async (req, res) => {
  try {
    const { vendorId, page = 1, limit = 10 } = req.query;
    if (!vendorId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Vendor ID is required",
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, count, avg] = await Promise.all([
      VendorReview.find({ vendor: vendorId })
        .populate("customer", "firstName lastName image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      VendorReview.countDocuments({ vendor: vendorId }),
      VendorReview.aggregate([
        {
          $match: {
            vendor: new (require("mongoose").Types.ObjectId)(vendorId),
          },
        },
        { $group: { _id: "$vendor", avgRating: { $avg: "$rating" } } },
      ]),
    ]);

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Vendor reviews fetched successfully",
      payload: {
        reviews: items,
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        averageRating: avg[0]?.avgRating || 0,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

// Upload a homepage banner (slides or banner1/banner2)
const uploadBanner = async (req, res) => {
  try {
    const { section = "slides", link = "" } = req.body; // section: slides | banner1 | banner2
    const { image } = req.body; // base64 string

    if (!image) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Image is required",
      });
    }

    // Upload to cloudinary using unsigned preset from settings
    const uploaded = await singleFileUploader(image);

    // Ensure settings exists
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        main: {
          businessName: "adhyatmah",
          domainName: "adhyatmah.com",
          websiteStatus: true,
          offlineMessage: "",
          seo: {
            metaTitle: "",
            metaDescription: "",
            description: "",
            tags: [],
          },
          gaId: "",
          gtmId: "",
          shippingFee: 0,
          commission: 0,
        },
        branding: {
          theme: { palette: {}, themeName: "default", fontFamily: "roboto" },
          logoDark: { _id: "", url: "" },
          logoLight: { _id: "", url: "" },
          favicon: { _id: "", url: "" },
          contact: {
            address: "",
            addressOnMap: "",
            lat: "",
            long: "",
            email: "",
            phone: "",
          },
          socialLinks: {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
          },
        },
        home: {
          slides: [],
          banner1: { image: { _id: "", url: "" }, link: "" },
          banner2: { image: { _id: "", url: "" }, link: "" },
        },
        general: {
          cloudinary: { cloudName: "", apiKey: "", apiSecret: "", preset: "" },
        },
      });
    }

    if (section === "slides") {
      settings.home.slides.push({ image: uploaded, link });
    } else if (section === "banner1") {
      settings.home.banner1 = { image: uploaded, link };
    } else if (section === "banner2") {
      settings.home.banner2 = { image: uploaded, link };
    } else {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid section. Use slides | banner1 | banner2",
      });
    }

    await settings.save();

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Banner uploaded successfully",
      payload: { section, image: uploaded, link },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: true, code: 400, status: 0, message: error.message });
  }
};

// Get banners for homepage
const getBanner = async (req, res) => {
  try {
    const settings = await Settings.findOne().lean();
    if (!settings) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Settings not found",
      });
    }
    const { slides = [], banner1 = null, banner2 = null } = settings.home || {};
    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Banners fetched successfully",
      payload: { slides, banner1, banner2 },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: true, code: 400, status: 0, message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  createService,
  getPanditProfile,
  getPanditList,
  getAllServices,
  getServiceById,
  getAvailableTimeSlots,
  getPanditServices,
  getAllPanditServices,
  checkPanditAvailability,
  getBookingById,
  cancelBooking,
  getBookingStats,
  getVendorBookingHistory,
  createVendorReview,
  getVendorReviews,
  uploadBanner,
  getBanner,
};
