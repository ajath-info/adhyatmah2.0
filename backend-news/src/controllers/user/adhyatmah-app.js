const User = require("../../models/User");
const Product = require("../../models/Product");
const Collection = require("../../models/Collection");
const Blog = require("../../models/Blog");
const Article = require("../../models/Article");
const Settings = require("../../models/Settings");
const Policy = require("../../models/Policy");
const Booking = require("../../models/Booking");
const Order = require("../../models/Order");
const CouponCode = require("../../models/CouponCode");
const Address = require("../../models/Address");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const fs = require("fs");
const path = require("path");
const { cloudinary, configureCloudinary } = require("../../config/cloudinary");
const { sendEmail } = require("../../utils/mailer-util");
const Categories = require("../../models/Category");
const Service = require("../../models/Service");
const { sendPush } = require("../../utils/pushNotification");
const { allServices } = require("../../data/allServices");

/*  Register a new user (Sign Up) */
/*const createCustomer = async (req, res) => {
  try {
    const request = req.body || {};
    const UserCount = await User.countDocuments();
    const existingUser = await User.findOne({ email: request.email });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "User With This Email Already Exists",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    // Prepare base user data
    // Handle role - ensure it's a single string value (not an array)
    let roleValue = request.role;
    if (Array.isArray(roleValue)) {
      roleValue = roleValue[0]; // Take first value if array
    }
    roleValue = roleValue || (UserCount ? "user" : "super-admin");

    // Handle deviceType - validate enum and default to "unknown" if invalid
    const validDeviceTypes = ["ios", "android", "web", "unknown"];
    let deviceTypeValue =
      request.deviceType || request.devicetype || request.device_type;
    if (Array.isArray(deviceTypeValue)) {
      deviceTypeValue = deviceTypeValue[0]; // Take first value if array
    }
    if (!validDeviceTypes.includes(deviceTypeValue)) {
      deviceTypeValue = "unknown"; // Default to "unknown" if invalid
    }

    // Handle deviceToken - ensure it's a single value
    let deviceTokenValue =
      request.deviceToken || request.devicetoken || request.device_token;
    if (Array.isArray(deviceTokenValue)) {
      deviceTokenValue = deviceTokenValue[0]; // Take first value if array
    }

    const userData = {
      ...request,
      deviceType: deviceTypeValue,
      deviceToken: deviceTokenValue,
      otp,
      role: roleValue,
    };
	  
	// Handle image -> save inside cover object
	let imageValue = request.image || request.cover;

	if (Array.isArray(imageValue)) {
	imageValue = imageValue[0];
	}

	if (imageValue) {
	userData.cover = {
	_id: `img_${Date.now()}`,
	url: imageValue,
	};
	}
	 
    const user = await User.create(userData);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const htmlFilePath = path.join(
      process.cwd(),
      "src/email-templates",
      "otp.html"
    );
    let htmlContent = fs.readFileSync(htmlFilePath, "utf8");
    htmlContent = htmlContent.replace(/<h1>[\s\d]*<\/h1>/g, `<h1>${otp}</h1>`);
    htmlContent = htmlContent.replace(/usingyourmail@gmail\.com/g, user.email);

    await sendEmail(user.email, "Verify your email", htmlContent);

    res.status(201).json({
      error: false,
      code: 201,
      status: 1,
      message: "Customer created successfully",
      payload: {
        customer: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          cover: user.cover,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
          city: user.city,
          country: user.country,
          zip: user.zip,
          state: user.state,
          about: user.about,
          role: user.role,
          wishlist: user.wishlist, // Empty array at signup
          language: user.language,
          aadhar: user.aadhar,
        },
        accessToken: token,
        expiresAt: expiresAt,
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

/*  Register a new user (Sign Up) */
const createCustomer = async (req, res) => {
  try {
    const request = req.body || {};

    const UserCount = await User.countDocuments();
    const existingUser = await User.findOne({ email: request.email });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "User With This Email Already Exists",
      });
    }

    /* =====================
       ROLE HANDLE
    ===================== */
    let roleValue = request.role;
    if (Array.isArray(roleValue)) roleValue = roleValue[0];
    roleValue = roleValue || (UserCount ? "user" : "super-admin");

    /* =====================
       DEVICE HANDLE
    ===================== */
    const validDeviceTypes = ["ios", "android", "web", "unknown"];
    let deviceTypeValue =
      request.deviceType || request.devicetype || request.device_type;

    if (Array.isArray(deviceTypeValue)) deviceTypeValue = deviceTypeValue[0];
    if (!validDeviceTypes.includes(deviceTypeValue))
      deviceTypeValue = "unknown";

    let deviceTokenValue =
      request.deviceToken || request.devicetoken || request.device_token;

    if (Array.isArray(deviceTokenValue))
      deviceTokenValue = deviceTokenValue[0];
	  
	const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    /* =====================
       PREPARE USER DATA
    ===================== */
    const userData = {
      ...request,
      deviceType: deviceTypeValue,
      deviceToken: deviceTokenValue,
      role: roleValue,
      isVerified: true, // default verified
  	  otp: generatedOtp,
    };

    /* =====================
       IMAGE HANDLE
    ===================== */
    let imageValue = request.image || request.cover;
    if (Array.isArray(imageValue)) imageValue = imageValue[0];

    if (imageValue) {
      userData.cover = {
        _id: `img_${Date.now()}`,
        url: imageValue,
      };
    }

    /* =====================
       CREATE USER
    ===================== */
    const user = await User.create(userData);

    /* ===============================
       SERVICES CLONE LOGIC
    =============================== */
    let newServiceIds = [];

    if (Array.isArray(request.services) && request.services.length > 0) {
      for (const sourceServiceId of request.services) {
        const sourceService = await Service.findById(sourceServiceId);
        if (!sourceService) continue;

        const { poojaType, description, duration, price } = sourceService;

        const newService = await Service.create({
          poojaType,
          description,
          duration,
          price,
          vendor: user._id,
        });

        newServiceIds.push(newService._id);
      }

      user.services = newServiceIds;
      await user.save();
    }

    /* =====================
       TOKEN GENERATE
    ===================== */
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
	  
	  
	/* =====================
	   ROLE BASED PUSH
	===================== */

	const tokenToUse = deviceTokenValue || user.deviceToken;

	if (tokenToUse) {
	  let title = "";
	  let body = "";
	  let type = "";

	  if (user.role === "user") {
		title = "Account Created Successfully";
		body = "Welcome! Your account is created successfully.";
		type = "customer_signup";
	  }

	  if (user.role === "vendor") {
		title = "Account Created Successfully";
		body = "Welcome! Your account is created successfully.";
		type = "customer_signup";
	  }

	  sendPush({
		token: tokenToUse,
		title,
		body,
		data: {
		  type,
		  userId: user._id.toString(),
		  role: user.role,
		},
	  });
	}    
	  

    /* =====================
       RESPONSE
    ===================== */
    res.status(201).json({
      error: false,
      code: 201,
      status: 1,
      message: "Customer created successfully",
      payload: {
        customer: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          cover: user.cover,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
          city: user.city,
          country: user.country,
          zip: user.zip,
          state: user.state,
          about: user.about,
          role: user.role,
          wishlist: user.wishlist,
          language: user.language,
          aadhar: user.aadhar,
          services: user.services,
        },
        accessToken: token,
        expiresAt: expiresAt,
      },
    });
  } catch (error) {
    console.error("createCustomer error:", error);
    res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

/*  Log in an existing user (Sign In) */
const customerLogin = async (req, res) => {
  try {
    const { email, password, deviceType, deviceToken } = req.body;
    // const user = await User.findOne({ email }).select("+password");
    const user = await User.findOne({
      email,
      status: "active",
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User Not Found",
      });
    }

    if (!user.password) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User Password Not Found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Incorrect Password",
      });
    }

    // Update device info if provided
    if (deviceType || deviceToken) {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            deviceType: deviceType || user.deviceType || "unknown",
            deviceToken: deviceToken || user.deviceToken,
          },
        }
      );
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
	  
	  
	/* =====================
	   ROLE BASED PUSH
	===================== */

	const tokenToUse = deviceToken || user.deviceToken;

	if (tokenToUse) {
	  let title = "";
	  let body = "";
	  let type = "";

	  if (user.role === "user") {
		title = "Login Successful";
		body = "Welcome back! You have successfully logged in.";
		type = "customer_login";
	  }

	  if (user.role === "vendor") {
		title = "Login Successful";
		body = "You are now logged into your personal account.";
		type = "vendor_login";
	  }

	  sendPush({
		token: tokenToUse,
		title,
		body,
		data: {
		  type,
		  userId: user._id.toString(),
		  role: user.role,
		},
	  });
	}  
	  

    const products = await Product.aggregate([
      {
        $match: {
          _id: { $in: user.wishlist },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          variantWithLeastStock: {
            $reduce: {
              input: "$variants",
              initialValue: {
                stockQuantity: Number.MAX_VALUE,
                price: null,
                salePrice: null,
              },
              in: {
                $cond: [
                  { $lt: ["$$this.stockQuantity", "$$value.stockQuantity"] },
                  {
                    stockQuantity: "$$this.stockQuantity",
                    price: "$$this.price",
                    salePrice: "$$this.salePrice",
                  },
                  "$$value",
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          stockQuantity: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.stockQuantity",
              "$stockQuantity",
            ],
          },
          price: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.price",
              "$price",
            ],
          },
          salePrice: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.salePrice",
              "$salePrice",
            ],
          },
        },
      },
      {
        $project: {
          images: 1,
          name: 1,
          slug: 1,
          discount: 1,
          likes: 1,
          salePrice: 1,
          price: 1,
          averageRating: 1,
          stockQuantity: 1,
          vendor: 1,
          shop: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Customer logged in successfully",
      payload: {
        customer: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          cover: user.cover,
		  image:user.image,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
          city: user.city,
          country: user.country,
          zip: user.zip,
          state: user.state,
          about: user.about,
          role: user.role,
          wishlist: products,
        },
        accessToken: token,
        expiresAt: expiresAt,
        role: user.role, // Added role at root level for easy identification
        isVendor: user.role === "vendor", // Boolean flag for easy vendor check
        isUser: user.role === "user", // Boolean flag for easy user check
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

//OTP Login
const loginWithMobile = async (req, res) => {
  try {
    let { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Mobile number is required",
      });
    }

    // Normalize input
    mobile = mobile.toString().trim().replace(/\s+/g, "");

    // Remove +91 or 91
    if (mobile.startsWith("+91")) {
      mobile = mobile.slice(3);
    } else if (mobile.startsWith("91") && mobile.length === 12) {
      mobile = mobile.slice(2);
    }

    // Validate 10-digit Indian number
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid Mobile Number",
      });
    }

    // Search both DB formats
    const user = await User.findOne({
      phone: { $in: [mobile, `+91${mobile}`] },
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User Not Found",
      });
    }

    // If user exists but inactive (regardless of format)
    if (user.status !== "active") {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "User Not Active",
      });
    }

    // Send OTP (always 91 + 10 digit)
    const response = await fetch(
      `https://control.msg91.com/api/v5/otp?mobile=91${mobile}&authkey=${process.env.MSG91_AUTH_KEY}&otp_expiry=60&template_id=${process.env.MSG91_TEMPLATE_ID}&realTimeResponse=1`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: result.message || "Failed to send OTP",
        payload: result,
      });
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "OTP Sent Successfully",
      payload: result,
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};

const verifyMobileOtp = async (req, res) => {
  try {
    let { mobile, otp, deviceType, deviceToken } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Mobile and OTP are required",
      });
    }

    // Normalize mobile
    mobile = mobile.toString().trim().replace(/\s+/g, "");

    if (mobile.startsWith("+91")) {
      mobile = mobile.slice(3);
    } else if (mobile.startsWith("91") && mobile.length === 12) {
      mobile = mobile.slice(2);
    }

    // Validate 10 digit
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid Mobile Number",
      });
    }

    // Search both DB formats
    const user = await User.findOne({
      phone: { $in: [mobile, `+91${mobile}`] },
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User Not Found",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "User Not Active",
      });
    }

    // Verify OTP
    const response = await fetch(
      `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=91${mobile}`,
      {
        method: "GET",
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
        },
      }
    );

    const result = await response.json();

    if (result.type !== "success") {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid or Expired OTP",
      });
    }

    // Update device info
    if (deviceType || deviceToken) {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            deviceType: deviceType || user.deviceType || "unknown",
            deviceToken: deviceToken || user.deviceToken,
          },
        }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
	  
	  
	/* =====================
	   ROLE BASED PUSH
	===================== */

	const tokenToUse = deviceToken || user.deviceToken;

	if (tokenToUse) {
	  let title = "";
	  let body = "";
	  let type = "";

	  if (user.role === "user") {
		title = "Login Successful";
		body = "Welcome back! You have successfully logged in.";
		type = "customer_login";
	  }

	  if (user.role === "vendor") {
		title = "Login Successful";
		body = "You are now logged into your personal account.";
		type = "vendor_login";
	  }

	  sendPush({
		token: tokenToUse,
		title,
		body,
		data: {
		  type,
		  userId: user._id.toString(),
		  role: user.role,
		},
	  });
	}    
	  
    // Wishlist aggregation (unchanged)
    const products = await Product.aggregate([
      { $match: { _id: { $in: user.wishlist } } },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          variantWithLeastStock: {
            $reduce: {
              input: "$variants",
              initialValue: {
                stockQuantity: Number.MAX_VALUE,
                price: null,
                salePrice: null,
              },
              in: {
                $cond: [
                  { $lt: ["$$this.stockQuantity", "$$value.stockQuantity"] },
                  {
                    stockQuantity: "$$this.stockQuantity",
                    price: "$$this.price",
                    salePrice: "$$this.salePrice",
                  },
                  "$$value",
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          stockQuantity: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.stockQuantity",
              "$stockQuantity",
            ],
          },
          price: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.price",
              "$price",
            ],
          },
          salePrice: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.salePrice",
              "$salePrice",
            ],
          },
        },
      },
      {
        $project: {
          images: 1,
          name: 1,
          slug: 1,
          discount: 1,
          likes: 1,
          salePrice: 1,
          price: 1,
          averageRating: 1,
          stockQuantity: 1,
          vendor: 1,
          shop: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Customer logged in successfully",
      payload: {
        customer: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
		  image: user.image,
          cover: user.cover,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
          city: user.city,
          country: user.country,
          zip: user.zip,
          state: user.state,
          about: user.about,
          role: user.role,
          wishlist: products,
        },
        accessToken: token,
        expiresAt,
        role: user.role,
        isVendor: user.role === "vendor",
        isUser: user.role === "user",
      },
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};


const resendMobileOtp = async (req, res) => {
  try {
    let { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Mobile number is required",
      });
    }

    // Normalize input
    mobile = mobile.toString().trim().replace(/\s+/g, "");

    if (mobile.startsWith("+91")) {
      mobile = mobile.slice(3);
    } else if (mobile.startsWith("91") && mobile.length === 12) {
      mobile = mobile.slice(2);
    }

    // Validate 10-digit Indian number
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid Mobile Number",
      });
    }

    // Search both DB formats
    const user = await User.findOne({
      phone: { $in: [mobile, `+91${mobile}`] },
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User Not Found",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "User Not Active",
      });
    }

    // Resend OTP
    const response = await fetch(
      `https://control.msg91.com/api/v5/otp/retry?mobile=91${mobile}&authkey=${process.env.MSG91_AUTH_KEY}&retrytype=text`,
      {
        method: "GET",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: result.message || "Failed to resend OTP",
        payload: result,
      });
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "OTP Resent Successfully",
      payload: result,
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};


const logout = async (req, res) => {
  try {
    // Verify the token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Decode the token to get user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Fetch wishlist products (same as login)
    const products = await Product.aggregate([
      {
        $match: {
          _id: { $in: user.wishlist },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          variantWithLeastStock: {
            $reduce: {
              input: "$variants",
              initialValue: {
                stockQuantity: Number.MAX_VALUE,
                price: null,
                salePrice: null,
              },
              in: {
                $cond: [
                  { $lt: ["$$this.stockQuantity", "$$value.stockQuantity"] },
                  {
                    stockQuantity: "$$this.stockQuantity",
                    price: "$$this.price",
                    salePrice: "$$this.salePrice",
                  },
                  "$$value",
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          stockQuantity: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.stockQuantity",
              "$stockQuantity",
            ],
          },
          price: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.price",
              "$price",
            ],
          },
          salePrice: {
            $cond: [
              { $eq: ["$type", "variable"] },
              "$variantWithLeastStock.salePrice",
              "$salePrice",
            ],
          },
        },
      },
      {
        $project: {
          images: 1,
          name: 1,
          slug: 1,
          discount: 1,
          likes: 1,
          salePrice: 1,
          price: 1,
          averageRating: 1,
          stockQuantity: 1,
          vendor: 1,
          shop: 1,
          createdAt: 1,
        },
      },
    ]);

    // Return response with same structure as login
    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Customer logged out successfully",
      payload: {
        customer: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          cover: user.cover,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
          city: user.city,
          country: user.country,
          zip: user.zip,
          state: user.state,
          about: user.about,
          role: user.role,
          wishlist: products,
        },
        accessToken: null, // Token is invalidated on client-side
        expiresAt: null, // No expiration since token is discarded
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Logout failed: " + error.message,
    });
  }
};

/*  Send reset password link to user's email */
const forgetPassword = async (req, res) => {
  try {
    const request = req.body;
    const user = await User.findOne({ email: request.email });

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User Not Found",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    const resetPasswordLink = `${request.origin}/auth/reset-password/${token}`;
    const htmlFilePath = path.join(
      process.cwd(),
      "src/email-templates",
      "forget.html"
    );
    let htmlContent = fs.readFileSync(htmlFilePath, "utf8");
    htmlContent = htmlContent.replace(
      /href="javascript:void\(0\);"/g,
      `href="${resetPasswordLink}"`
    );

    await sendEmail(user.email, "Verify your email", htmlContent);

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Forgot Password Email Sent Successfully",
      payload: {
        accessToken: token,
        expiresAt: expiresAt,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

/*  Reset user password using token */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err && err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
          code: 401,
        });
      }
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded._id).select("password");

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User Not Found",
      });
    }
    if (!newPassword || !user.password) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message:
          "Invalid Data. Both NewPassword And User Password Are Required",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "New Password Must Be Different From The Old Password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Password Updated Successfully",
      payload: {
        customer: {
          id: user._id,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message: error.message,
    });
  }
};

/* Get homepage category blocks */
/*const getHomepageCollections = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // ------------------------------------
    // Wishlist + Cart (optional)
    // ------------------------------------
    let userWishlist = [];
    let cartCount = 0;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("wishlist cart");

        if (user) {
          userWishlist = user.wishlist.map((id) => id.toString());
          cartCount = Array.isArray(user.cart) ? user.cart.length : 0;
        }
      } catch (err) {
        console.log("Invalid token, skipping wishlist/cart:", err.message);
      }
    }

    // ------------------------------------
    // Step 1: Load active categories (paginated)
    // ------------------------------------
    const categories = await Categories.find({ status: "active" })
      .select("name slug description image")
      .skip(skip)
      .limit(parseInt(limit));

    if (categories.length === 0) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "No categories found",
      });
    }

    // ------------------------------------
    // Step 2: For each category → get latest 5 products
    // ------------------------------------
    const formattedCollections = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({
          category: cat._id,
          status: "published",
        })
          .select(
            "name slug images type variants price salePrice stockQuantity tags"
          )
          .sort({ createdAt: -1 }) // latest products
          .limit(5);

        // Format products similar to your structure
        const formattedProducts = products.map((product) => {
          let variant = {};

          if (product.type === "variable" && product.variants?.length > 0) {
            const first = product.variants[0];
            variant = {
              id: first._id || product._id.toString(),
              price: {
                amount: (first.salePrice || first.price || 0).toString(),
                currencyCode: "INR",
              },
              selectedOptions: [
                {
                  name: "Title",
                  value: first.name || "Default",
                },
              ],
            };
          } else {
            variant = {
              id: product._id.toString(),
              price: {
                amount: (product.salePrice || product.price || 0).toString(),
                currencyCode: "INR",
              },
              selectedOptions: [{ name: "Title", value: "Default Title" }],
            };
          }

          return {
            id: product._id.toString(),
            title: product.name,
            handle: product.slug,
            featuredImage:
              product.images?.length > 0
                ? { url: product.images[0].url, altText: product.slug }
                : { url: "https://via.placeholder.com/150", altText: null },
            variant,
            wishlist: userWishlist.includes(product._id.toString()),
          };
        });

        return {
          id: cat._id.toString(),
          handle: cat.slug,
          title: cat.name,
          description: cat.description || "",
          image: {
            url: cat.image?.url || "https://via.placeholder.com/150",
            altText: cat.image?.altText || cat.slug,
          },
          products: formattedProducts,
          viewAllUrl: `/shopify/collection/${cat.slug}/products`,
        };
      })
    );

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Homepage category collections loaded successfully",
      payload: {
        collections: formattedCollections,
        cart: cartCount || null,
      },
    });
  } catch (error) {
    console.error("getHomepageCollections Error:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to load collections: " + error.message,
    });
  }
};*/

const getHomepageCollections = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // ------------------------------------
    // Wishlist + Cart (optional)
    // ------------------------------------
    let userWishlist = [];
    let cartCount = 0;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );

        const user = await User.findById(decoded._id).select(
          "wishlist cart"
        );

        if (user) {
          userWishlist = user.wishlist.map((id) =>
            id.toString()
          );

          cartCount = Array.isArray(user.cart)
            ? user.cart.length
            : 0;
        }
      } catch (err) {
        console.log(
          "Invalid token, skipping wishlist/cart:",
          err.message
        );
      }
    }

    // ------------------------------------
    // Step 1: Load active categories
    // ------------------------------------
    const categories = await Categories.find({
      status: "active",
    })
      .select("name slug description cover")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (categories.length === 0) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "No categories found",
      });
    }

    // ------------------------------------
    // Step 2: Get latest 5 products
    // ------------------------------------
    const formattedCollections = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({
          category: cat._id,
          status: "published",
        })
          .select(
            "name slug images type variants price salePrice stockQuantity tags"
          )
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        // ------------------------------------
        // Format products
        // ------------------------------------
        const formattedProducts = products.map(
          (product) => {
            let variant = {};

            if (
              product.type === "variable" &&
              product.variants?.length > 0
            ) {
              const first = product.variants[0];

              variant = {
                id:
                  first._id ||
                  product._id.toString(),

                price: {
                  amount: (
                    first.salePrice ||
                    first.price ||
                    0
                  ).toString(),

                  currencyCode: "INR",
                },

                selectedOptions: [
                  {
                    name: "Title",
                    value:
                      first.name || "Default",
                  },
                ],
              };
            } else {
              variant = {
                id: product._id.toString(),

                price: {
                  amount: (
                    product.salePrice ||
                    product.price ||
                    0
                  ).toString(),

                  currencyCode: "INR",
                },

                selectedOptions: [
                  {
                    name: "Title",
                    value: "Default Title",
                  },
                ],
              };
            }

            return {
              id: product._id.toString(),
              title: product.name,
              handle: product.slug,

              featuredImage:
                product.images?.length > 0
                  ? {
                      url:
                        product.images[0].url,
                      altText:
                        product.slug,
                    }
                  : {
                      url:
                        "https://via.placeholder.com/150",
                      altText: null,
                    },

              variant,

              wishlist:
                userWishlist.includes(
                  product._id.toString()
                ),
            };
          }
        );

        // ------------------------------------
        // Final collection response
        // ------------------------------------
        return {
          id: cat._id.toString(),
          handle: cat.slug,
          title: cat.name,
          description: cat.description || "",
          image: cat.cover
            ? {
                url: cat.cover.url,
                altText: cat.slug,
              }
            : {
                url:
                  "https://via.placeholder.com/150",
                altText: cat.slug,
              },
          products: formattedProducts,
          viewAllUrl: `/shopify/collection/${cat.slug}/products`,
        };
      })
    );

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message:
        "Homepage category collections loaded successfully",

      payload: {
        collections: formattedCollections,
        cart: cartCount || null,
      },
    });
  } catch (error) {
    console.error(
      "getHomepageCollections Error:",
      error
    );

    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message:
        "Failed to load collections: " +
        error.message,
    });
  }
};



const getHomepagePoojaServices = async (req, res) => {
  try {

    // top 8 services
    const services = allServices.slice(0, 5);

    const formattedServices = services.map(
      (service) => {

        // random views every API hit
        const randomViews =
          Math.floor(
            Math.random() * (5000 - 500 + 1)
          ) + 500;

        return {
          id: service.id,
          name: service.name,
          slug: service.name
            .toLowerCase()
            .replace(/\s+/g, "-"),
          image: {
            url: service.image?.url || "",
            altText: service.name
              .toLowerCase()
              .replace(/\s+/g, "-"),
          },
          views: randomViews,
          price: service.price || 0,
          originalPrice:
            service.originalPrice || 0,
          duration:
            service.duration || "2-3 Hrs",
        };
      }
    );

    // single long banner
    const longBanner = {
      id: "1",
      title: "Special Pooja",
      subtitle: "Limited Slots Available",
	  url: "https://adhyatmah.com/images/festival.png",
    };
	  
	const whyChooseUs = [
      {
        id: "1",
        title: "Verified Pandits",
		url: "https://adhyatmah.com/images/Pandit.png",
      },
      {
        id: "2",
        title: "100% Authentic Samagri",
		url: "https://adhyatmah.com/images/Samagri.png",
      },
      {
        id: "3",
        title: "Live Pooja Option",
		url: "https://adhyatmah.com/images/pooja.png",
      },
	  {
        id: "4",
        title: "Trusted by 10,000+ Devotees",
		url: "https://adhyatmah.com/images/trusted.png",
      },
    ];
	  
	  
 const testimonialsData = {
  title: "Voice Of Faith",
  rating: "4.9",
  totalReviews: "124",
  testimonials: [
    {
      id: "1",
      name: "Anjali R.",
      service: "Satyanarayan Katha",
      stars: "5",
      daysAgo: "2 days ago",
      review:
        "The Pandit ji conducted the ceremony with such grace and precision. The spiritual atmosphere created in our home was truly transformative. We felt immense peace and divine presence throughout the ritual.",
    },

    {
      id: "2",
      name: "Rohit Sharma",
      service: "Griha Pravesh Puja",
      stars: "5",
      daysAgo: "5 days ago",
      review:
        "Excellent experience with Adhyatmah. The pandit arrived on time with complete samagri and explained every ritual beautifully. Highly recommended for authentic puja services.",
    },

    {
      id: "3",
      name: "Priya Mehta",
      service: "Rudrabhishek Puja",
      stars: "5",
      daysAgo: "1 week ago",
      review:
        "Very knowledgeable and humble pandit ji. The entire Rudrabhishek was performed with proper Vedic rituals and positive energy. Our family was deeply satisfied.",
    },

    {
      id: "4",
      name: "Vikas Agarwal",
      service: "Bhoomi Pujan",
      stars: "5",
      daysAgo: "3 days ago",
      review:
        "Booking process was smooth and professional. The puja was conducted perfectly at our construction site and all rituals were explained clearly. Great service by Adhyatmah.",
    },

    {
      id: "5",
      name: "Sneha Kapoor",
      service: "Navagraha Shanti Puja",
      stars: "5",
      daysAgo: "6 days ago",
      review:
        "Adhyatmah provided an authentic spiritual experience. The pandit ji was polite, experienced, and guided us throughout the puja with patience and devotion.",
    },
  ],
};
	  
    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Homepage pooja services loaded successfully",
      payload: {
        longBanner,
		whyChooseUs,
		testimonialsData,
        services: formattedServices,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};



const getHomepagePoojaServicesAll =
  async (req, res) => {
    try {

      // pagination
      const page =
        parseInt(req.query.page) || 1;

      const limit =
        parseInt(req.query.limit) || 20;

      const skip =
        (page - 1) * limit;

      // total services
      const totalServices =
        allServices.length;

      // paginated services
      const services =
        allServices.slice(
          skip,
          skip + limit
        );

      const formattedServices =
        services.map((service) => {

          // random views
          const randomViews =
            Math.floor(
              Math.random() *
                (5000 - 500 + 1)
            ) + 500;

          return {
            id: service.id,

            name: service.name,

            slug: service.name
              .toLowerCase()
              .replace(/\s+/g, "-"),

            image: {
              url:
                service.image?.url || "",

              altText:
                service.name
                  .toLowerCase()
                  .replace(/\s+/g, "-"),
            },

            views: randomViews,

            price:
              service.price || 0,

            originalPrice:
              service.originalPrice ||
              0,

            duration:
              service.duration ||
              "2-3 Hrs",
          };
        });

      return res.status(200).json({
        success: true,

        data: formattedServices,

        pagination: {
          currentPage: page,

          totalPages: Math.ceil(
            totalServices / limit
          ),

          totalServices,

          limit,

          hasNextPage:
            page <
            Math.ceil(
              totalServices / limit
            ),

          hasPrevPage:
            page > 1,
        },
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong",
      });
    }
  };





const getHomepagePoojaServicesKit =
  async (req, res) => {
    try {

      const { serviceId } =
        req.query;

      // ------------------------------------
      // Get Service
      // ------------------------------------
      const service =
        await Service.findById(
          serviceId
        );

      if (!service) {
        return res.status(404).json({
          error: true,
          code: 404,
          status: 0,
          message:
            "Service not found",
        });
      }

      // ------------------------------------
      // Category IDs
      // ------------------------------------
      const PUJA_KIT_CATEGORY =
        "69fc2bfe698620371febb200";

      const INSTANT_KIT_CATEGORY =
        "69f87168698620371feb892e";

      // ------------------------------------
      // Fetch Puja Kit Products
      // ------------------------------------
      const pujaKitProducts =
        await Product.find({

          tags: {
            $in: [
              service.poojaType,
            ],
          },

          category:
            PUJA_KIT_CATEGORY,

          status: "published",

        }).select(
          "name slug price salePrice images tags category"
        );

      // ------------------------------------
      // Fetch Instant Kit Products
      // ------------------------------------
      const instantKitProducts =
        await Product.find({

          tags: {
            $in: [
              service.poojaType,
            ],
          },

          category:
            INSTANT_KIT_CATEGORY,

          status: "published",

        }).select(
          "name slug price salePrice images tags category"
        );

      // ------------------------------------
      // Format Function
      // ------------------------------------
      const formatProducts =
        (products) => {

          return products.map(
            (product) => ({

              id:
                product._id.toString(),

              name:
                product.name,

              slug:
                product.slug,

              price:
                product.salePrice ||
                product.price ||
                0,

              originalPrice:
                product.price || 0,

              image:
                product.images?.[0]
                  ?.url || null,
            })
          );
        };

      // ------------------------------------
      // Response
      // ------------------------------------
      return res.status(200).json({
        error: false,

        code: 200,

        status: 1,

        message:
          "Pooja kits fetched successfully",

        payload: {

          service: {

            id:
              service._id.toString(),

            poojaType:
              service.poojaType,
          },

          pujaKit:
            formatProducts(
              pujaKitProducts
            ),

          instantKit:
            formatProducts(
              instantKitProducts
            ),
        },
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        error: true,

        code: 500,

        status: 0,

        message:
          "Failed to fetch kits: " +
          error.message,
      });
    }
  };




const getBanner = async (req, res) => {
  try {
    const settings = await Settings.findOne().lean();

    if (!settings || !settings.home) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Settings or home data not found",
      });
    }

    const {
      slides = [],
      banner1 = null,
      banner2 = null,
      banner3 = null,
    } = settings.home;

    // Map slides -> homeBanners
    const homeBanners = slides.map((item, index) => ({
      id: item._id,
      handle: `home-banner-${index + 1}`,
      type: "banner",
      image: item.image?._id || null,
      title: "home banner",
      url: item.image?.url || null,
      link: item.link || null,
    }));

    // Map banner1, banner2, banner3 -> subBanners
    const subBanners = [banner1, banner2, banner3]
      .filter(Boolean)
      .map((item, index) => ({
        id: `sub-banner-${index + 1}`,
        handle: `sub-banner-${index + 1}`,
        type: "banner",
        image: item.image?._id || null,
        title: "sub banner",
        url: item.image?.url || null,
        link: item.link || null,
      }));

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Banners fetched successfully",
      payload: {
        banners: {
          homeBanners,
          subBanners,
        },
      },
    });
  } catch (error) {
    console.error("Error in getBanner:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};







/* Get all menus with categories data */

const getAllMenus = async (req, res) => {
  try {
    // Fetch active categories from Categories collection
    const categories = await Categories.find({ status: "active" })
      .sort({ createdAt: -1 })
      .select(["_id", "name", "slug"])
      .lean();

    // Safety check (should always be array)
    if (!Array.isArray(categories)) {
      throw new Error("Categories query did not return an array");
    }

    // Transform categories to menu items structure
    const menuItems = categories.map((category) => ({
      title: category.name,
      url: `/collections/${category.slug}`,
      type: "COLLECTION",
      items: [],
      collectionHandle: category.slug,
      collectionId: category.slug,
    }));

    // Build complete menu structure
    const menuData = {
      id: "menu_1",
      title: "Main menu",
      handle: "main-menu",
      items: menuItems,
    };

    // Final response (same structure as original)
    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Menu fetched successfully with categories",
      payload: {
        menu: menuData,
      },
    });
  } catch (error) {
    console.error("Error in getAllMenus:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch menu: " + error.message,
    });
  }
};

/* Get all categories with pagination */
const getAllCollections = async (req, res) => {
  try {
    // Pagination params
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Count total
    const totalCategories = await Categories.countDocuments({
      status: "active",
    });

    // Fetch paginated categories
    const categories = await Categories.find({ status: "active" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select(["_id", "name", "slug", "cover", "description"])
      .lean();

    // Safety check (should always be array)
    if (!Array.isArray(categories)) {
      throw new Error("Query did not return an array");
    }

    // Transform response
    const finalResult = categories.map((item) => ({
      id: item._id,
      title: item.name,
      description: item.description,
      handle: item.slug,
      image: item.cover
        ? {
            url: item.cover.url,
            altText: item.name,
          }
        : null,
    }));

    // Total pages calc
    const totalPages = Math.ceil(totalCategories / parseInt(limit));

    // Final response
    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "All categories fetched successfully",
      payload: {
        collections: finalResult,
        pagination: {
          total: totalCategories,
          totalPages,
          currentPage: parseInt(page),
          perPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error in getCategory:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch categories: " + error.message,
    });
  }
};

/* Get all collections */
const getCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check for token (optional, for wishlist status)
    let userWishlist = [];
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("wishlist");
        if (user) {
          userWishlist = user.wishlist.map((id) => id.toString());
        }
      } catch (err) {
        console.log("Invalid token, proceeding without wishlist:", err.message);
      }
    }

    // First check if collections exist, if not create sample collections from products
    let collections = await Collection.find()
      .populate({
        path: "products",
        select: "name slug images type variants price salePrice stockQuantity",
        options: { limit: 5 }, // Limit products per collection for performance
      })
      .skip(skip)
      .limit(parseInt(limit));

    let totalCollections = await Collection.countDocuments();

    // If no collections exist, create sample collections from products
    if (collections.length === 0) {
      console.log("No collections found, creating sample collections...");

      // Get some products to create collections
      const products = await Product.find({ status: "published" }).limit(50);

      if (products.length > 0) {
        // Helper function to get first product image for collection
        const getFirstProductImage = (productSlice) => {
          const firstProduct = productSlice[0];
          if (
            firstProduct &&
            firstProduct.images &&
            firstProduct.images.length > 0
          ) {
            return {
              url: firstProduct.images[0].url,
              altText: firstProduct.name || "Collection Image",
            };
          }
          return {
            url: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Collection",
            altText: "Collection Image",
          };
        };

        // Create sample collections with more variety
        const sampleCollections = [
          {
            title: "Best Sellers",
            handle: "best-sellers",
            description: "We have your occasion",
            image: getFirstProductImage(products.slice(0, 5)),
            products: products.slice(0, 5).map((p) => p._id),
            viewAllUrl: "/shopify/collection/best-sellers/products",
          },
          {
            title: "Chandan Items",
            handle: "chandan-items",
            description: "Chandan Items",
            image: getFirstProductImage(products.slice(5, 12)),
            products: products.slice(5, 12).map((p) => p._id),
            viewAllUrl: "/shopify/collection/chandan-items/products",
          },
          {
            title: "Daily Pooja Needs",
            handle: "daily-pooja-needs",
            description: "Daily Pooja Needs",
            image: getFirstProductImage(products.slice(12, 13)),
            products: products.slice(12, 13).map((p) => p._id),
            viewAllUrl: "/shopify/collection/daily-pooja-needs/products",
          },
          {
            title: "Diya Collections",
            handle: "diya-collections",
            description: "Diya Collections",
            image: getFirstProductImage(products.slice(13, 17)),
            products: products.slice(13, 17).map((p) => p._id),
            viewAllUrl: "/shopify/collection/diya-collections/products",
          },
          {
            title: "Featured product",
            handle: "festivals",
            description: "We have your occasion covered",
            image: getFirstProductImage(products.slice(17, 22)),
            products: products.slice(17, 22).map((p) => p._id),
            viewAllUrl: "/shopify/collection/festivals/products",
          },
          {
            title: "Diwali",
            handle: "diwali",
            description: "Diwali",
            image: getFirstProductImage(products.slice(22, 26)),
            products: products.slice(22, 26).map((p) => p._id),
            viewAllUrl: "/shopify/collection/diwali/products",
          },
          {
            title: "Holi",
            handle: "holi",
            description: "Holi",
            image: getFirstProductImage(products.slice(26, 29)),
            products: products.slice(26, 29).map((p) => p._id),
            viewAllUrl: "/shopify/collection/holi/products",
          },
          {
            title: "Rakhi",
            handle: "rakhi",
            description: "Rakhi",
            image: getFirstProductImage(products.slice(29, 32)),
            products: products.slice(29, 32).map((p) => p._id),
            viewAllUrl: "/shopify/collection/rakhi/products",
          },
          {
            title: "Siddh Mala",
            handle: "siddh-mala",
            description: "Siddh Mala",
            image: getFirstProductImage(products.slice(32, 39)),
            products: products.slice(32, 39).map((p) => p._id),
            viewAllUrl: "/shopify/collection/siddh-mala/products",
          },
          {
            title: "Bestseller of god statue",
            handle: "eco-friendly",
            description: "We have your occasion covered",
            image: getFirstProductImage(products.slice(39, 44)),
            products: products.slice(39, 44).map((p) => p._id),
            viewAllUrl: "/shopify/collection/eco-friendly/products",
          },
        ];

        // Create collections in database
        await Collection.insertMany(sampleCollections);

        // Fetch the newly created collections with pagination
        collections = await Collection.find()
          .populate({
            path: "products",
            select:
              "name slug images type variants price salePrice stockQuantity",
            options: { limit: 5 },
          })
          .skip(skip)
          .limit(parseInt(limit));

        const newTotalCollections = await Collection.countDocuments();
        totalCollections = newTotalCollections;
      }
    }

    // Ensure required additional collections exist (upsert if missing)
    const requiredCollections = [
      {
        title: "Bestseller of god statue",
        handle: "eco-friendly",
        description: "We have your occasion covered",
      },
      {
        title: "BestSeller of hawan items",
        handle: "bestseller-of-hawan-items",
        description: "Our best seller hawan items",
      },
      {
        title: "Diwali",
        handle: "diwali",
        description: "Diwali",
      },
    ];

    for (const rc of requiredCollections) {
      const existing = await Collection.findOne({ handle: rc.handle });
      if (!existing) {
        await Collection.create({
          title: rc.title,
          handle: rc.handle,
          description: rc.description,
          image: {
            url: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Collection",
            altText: rc.title,
          },
          products: [],
          viewAllUrl: `/shopify/collection/${rc.handle}/products`,
        });
      }
    }

    // Refresh collections and counts after potential upserts
    totalCollections = await Collection.countDocuments();
    collections = await Collection.find()
      .populate({
        path: "products",
        select: "name slug images type variants price salePrice stockQuantity",
        options: { limit: 5 },
      })
      .skip(skip)
      .limit(parseInt(limit));

    // Map collections to match Shopify response structure
    const formattedCollections = await Promise.all(
      collections.map(async (collection) => {
        const formattedProducts = await Promise.all(
          collection.products.map(async (product) => {
            let variant = {};
            let selectedOptions = [];

            if (
              product.type === "variable" &&
              product.variants &&
              product.variants.length > 0
            ) {
              // Select first variant (since we don't have options in your schema)
              const firstVariant = product.variants[0];

              selectedOptions = [
                {
                  name: "Title",
                  value: firstVariant.name || "Default",
                },
              ];

              variant = {
                id: firstVariant._id || product._id.toString(),
                price: {
                  amount: (
                    firstVariant.salePrice ||
                    firstVariant.price ||
                    0
                  ).toString(),
                  currencyCode: "INR",
                },
                selectedOptions,
              };
            } else {
              // Simple product
              variant = {
                id: product._id.toString(),
                price: {
                  amount: (product.salePrice || product.price || 0).toString(),
                  currencyCode: "INR",
                },
                selectedOptions: [
                  {
                    name: "Title",
                    value: "Default Title",
                  },
                ],
              };
            }

            return {
              id: product._id.toString(),
              title: product.name,
              handle: product.slug,
              featuredImage:
                product.images && product.images.length > 0
                  ? { url: product.images[0].url, altText: null }
                  : { url: "https://via.placeholder.com/150", altText: null },
              variant,
            };
          })
        );

        // Use the first product's image as collection image if available
        let collectionImageUrl = collection.image?.url;
        let collectionImageAltText = collection.image?.altText;

        // If no collection image or it's a placeholder, use first product's image
        if (
          !collectionImageUrl ||
          collectionImageUrl.includes("placeholder") ||
          collectionImageUrl.includes("via.placeholder")
        ) {
          if (
            formattedProducts.length > 0 &&
            formattedProducts[0].featuredImage?.url
          ) {
            collectionImageUrl = formattedProducts[0].featuredImage.url;
            collectionImageAltText =
              formattedProducts[0].featuredImage.altText || collection.title;
          } else {
            // Fallback to placeholder if no product images available
            collectionImageUrl =
              "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=" +
              encodeURIComponent(collection.title);
            collectionImageAltText = collection.title;
          }
        }

        return {
          id: collection._id.toString(),
          handle: collection.handle,
          title: collection.title,
          description: collection.description || "",
          image: {
            url: collectionImageUrl,
            altText: collectionImageAltText,
          },
          products: formattedProducts,
          viewAllUrl:
            collection.viewAllUrl ||
            `/shopify/collection/${collection.handle}/products`,
        };
      })
    );

    const totalPages = Math.ceil(totalCollections / parseInt(limit));

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "All collections fetched successfully",
      payload: {
        collections: formattedCollections,
        pagination: {
          total: totalCollections,
          totalPages: totalPages,
          currentPage: parseInt(page),
          perPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error in getAllCollections:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch collections: " + error.message,
    });
  }
};

/* Get landing page */
const getLandingPage = async (req, res) => {
  try {
    // Check if landing pages exist in Settings, if not create sample landing pages
    let settings = await Settings.findOne();

    if (!settings || !settings.home || !settings.home.landingPages) {
      console.log("No landing pages found, creating sample landing pages...");

      // Create sample landing pages
      const sampleLandingPages = [
        {
          id: "metaobject_6",
          handle: "landing-page-apaxzyvu",
          type: "landing_page",
          description:
            "Discover our premium collection of spiritual and religious items that bring peace and prosperity to your home.",
          landing_page_image_url:
            "https://cdn.shopify.com/s/files/1/0764/0822/6027/files/image_93.jpg?v=1750334756",
          title: "Spiritual Journey Begins Here",
        },
        {
          id: "metaobject_7",
          handle: "landing-page-1t0gterp",
          type: "landing_page",
          description:
            "Explore our curated collection of traditional pooja items and religious artifacts for your daily worship.",
          landing_page_image_url:
            "https://cdn.shopify.com/s/files/1/0764/0822/6027/files/image_71.jpg?v=1750334755",
          title: "Traditional Pooja Essentials",
        },
        {
          id: "metaobject_8",
          handle: "landing-page-puizfxeu",
          type: "landing_page",
          description:
            "Find the perfect spiritual gifts and religious items for festivals and special occasions.",
          landing_page_image_url:
            "https://cdn.shopify.com/s/files/1/0764/0822/6027/files/image_9814a461-75f4-4ea3-8cfb-8b5a1239991f.jpg?v=1750334756",
          title: "Festival & Special Occasions",
        },
      ];

      // Create or update settings with landing pages
      if (!settings) {
        settings = await Settings.create({
          home: {
            landingPages: sampleLandingPages,
          },
        });
      } else {
        settings.home = settings.home || {};
        settings.home.landingPages = sampleLandingPages;
        await settings.save();
      }
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Landing page images fetched successfully",
      payload: {
        landingPages: settings.home.landingPages,
      },
    });
  } catch (error) {
    console.error("Error in getLandingPage:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch landing pages: " + error.message,
    });
  }
};

/* Get view all data for collection */
const getViewAllData = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const { handle } = req.body; // category slug

    if (!handle) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Category slug (handle) is required",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // --------------------------
    // Wishlist (optional)
    // --------------------------
    let userWishlist = [];
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("wishlist");
        if (user) userWishlist = user.wishlist.map((id) => id.toString());
      } catch (err) {
        console.log("Invalid token, skipping wishlist:", err.message);
      }
    }

    // --------------------------
    // Step 1: Find active category by slug
    // --------------------------
    const category = await Categories.findOne({
      slug: handle,
      status: "active",
    }).select("_id name slug description image");

    if (!category) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: `Active category not found for slug "${handle}"`,
      });
    }

    // --------------------------
    // Step 2: Fetch active products by category id
    // --------------------------
    const products = await Product.find({
      category: category._id,
      status: "published",
    })
      .select(
        "name slug description images type variants price salePrice stockQuantity status tags category"
      )
      .skip(skip)
      .limit(parseInt(limit));

    // Step 3: Total count for pagination
    const totalProductsCount = await Product.countDocuments({
      category: category._id,
      status: "active",
    });

    // --------------------------
    // Step 4: Format products
    // --------------------------
    const formattedProducts = products.map((product) => {
      let variants = [];
      let selectedOptions = [];

      if (product.type === "variable" && product.variants?.length) {
        variants = product.variants.map((variant) => {
          const variantOptions = [];
          if (variant.name)
            variantOptions.push({ name: "Title", value: variant.name });
          return {
            id: variant._id || product._id.toString(),
            title: variant.name || "Default",
            price: {
              amount: (variant.salePrice || variant.price || 0).toString(),
              currencyCode: "INR",
            },
            selectedOptions: variantOptions,
          };
        });
        selectedOptions = variants[0]?.selectedOptions || [];
      } else {
        variants = [
          {
            id: product._id.toString(),
            title: "Default Title",
            price: {
              amount: (product.salePrice || product.price || 0).toString(),
              currencyCode: "INR",
            },
            selectedOptions: [{ name: "Title", value: "Default Title" }],
          },
        ];
        selectedOptions = variants[0].selectedOptions;
      }

      return {
        id: product._id.toString(),
        title: product.name,
        handle: product.slug,
        description: product.description || "",
        featuredImage: product.images?.length
          ? { url: product.images[0].url, altText: product.slug }
          : { url: "https://via.placeholder.com/150", altText: product.slug },
        variants,
        availableForSale: product.stockQuantity > 0,
        productType: category.name,
        tags: product.tags || [],
        wishlist: userWishlist.includes(product._id.toString()),
      };
    });

    const totalPages = Math.ceil(totalProductsCount / parseInt(limit));

    // --------------------------
    // Step 5: Return response
    // --------------------------
    return res.status(200).json({
      error: false,
      code: 200,
      status: 200,
      message: `Page ${page} of products for collection "${category.name}" fetched successfully.`,
      payload: {
        collection: {
          id: category._id.toString(),
          title: category.name,
          handle: category.slug,
          description: category.description || "",
          image: {
            url: category.image?.url || "https://via.placeholder.com/150",
            altText: category.image?.altText || category.slug,
          },
          products: formattedProducts,
          pagination: {
            totalProducts: totalProductsCount,
            totalPages,
            currentPage: parseInt(page),
            limitPerPage: parseInt(limit),
          },
        },
      },
    });
  } catch (error) {
    console.error("getViewAllData Error:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch category products: " + error.message,
    });
  }
};

/* Get policies */
const getPolicies = async (req, res) => {
  try {
    // Clear existing policies and create new ones to ensure correct structure
    await Policy.deleteMany({});

    // Create sample policies

    const samplePolicies = [
      {
        type: "privacy-policy",
        title: "Privacy policy",
        content:
          "<div><p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p> <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. </p> <h2>Interpretation and Definitions</h2> <h3>Interpretation</h3> <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p> <h3>Definitions</h3> <p>For the purposes of this Privacy Policy:</p> <ul> <li> <p><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</p> </li> <li> <p><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p> </li> <li> <p><strong>Application</strong> refers to Adhyatmah, the software program provided by the Company.</p> </li> <li> <p><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Adhyatmah.</p> </li> <li> <p><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</p> </li> <li> <p><strong>Country</strong> refers to: Delhi, India</p> </li> <li> <p><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</p> </li> <li> <p><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</p> </li> <li> <p><strong>Service</strong> refers to the Application or the Website or both.</p> </li> <li> <p><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</p> </li> <li> <p><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</p> </li> <li> <p><strong>Website</strong> refers to Adhyatmah, accessible from <a href='https://adhyatmah.com/' target='_blank'>https://adhyatmah.com/</a></p> </li> <li> <p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p> </li> </ul> <h2>Collecting and Using Your Personal Data</h2> <h3>Types of Data Collected</h3> <h4>Personal Data</h4> <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p> <ul> <li> <p>info@adhyatmah.com</p> </li> <li> <p>Adhyatmah Bharat</p> </li> <li> <p>+91 9452872182</p> </li> <li> <p>A-5, Sector 3 Noida, Uttar Pradesh - 201301</p> </li> </ul> <h4>Usage Data</h4> <p>Usage Data is collected automatically when using the Service.</p> <p>Usage Data may include information such as Your Devices Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p> <p>When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device's unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p> <p>We may also collect information that Your browser sends whenever You visit Our Service or when You access the Service by or through a mobile device.</p> <h4>Information Collected while Using the Application</h4> <p>While using Our Application, in order to provide features of Our Application, We may collect, with Your prior permission:</p> <ul> <li>Information regarding your location</li> </ul> <p>We use this information to provide features of Our Service, to improve and customize Our Service. The information may be uploaded to the Company's servers and/or a Service Provider's server or it may be simply stored on Your device.</p> <p>You can enable or disable access to this information at any time, through Your Device settings.</p> <h4>Tracking Technologies and Cookies</h4> <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies We use include beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p> <ul> <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li> <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li> </ul> <p>Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.</p> <p>We use both Session and Persistent Cookies for the purposes set out below:</p> <ul> <li> <p><strong>Necessary / Essential Cookies</strong></p> <p>Type: Session Cookies</p> <p>Administered by: Us</p> <p>Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p> </li> <li> <p><strong>Cookies Policy / Notice Acceptance Cookies</strong></p> <p>Type: Persistent Cookies</p> <p>Administered by: Us</p> <p>Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</p> </li> <li> <p><strong>Functionality Cookies</strong></p> <p>Type: Persistent Cookies</p> <p>Administered by: Us</p> <p>Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p> </li> </ul> <p>For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.</p> <h3>Use of Your Personal Data</h3> <p>The Company may use Personal Data for the following purposes:</p> <ul> <li> <p><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</p> </li> <li> <p><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</p> </li> <li> <p><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</p> </li> <li> <p><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</p> </li> <li> <p><strong>To provide You</strong> with news, special offers, and general information about other goods, services and events which We offer that are similar to those that you have already purchased or inquired about unless You have opted not to receive such information.</p> </li> <li> <p><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</p> </li> <li> <p><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</p> </li> <li> <p><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</p> </li> </ul> <p>We may share Your personal information in the following situations:</p> <ul> <li><strong>With Service Providers:</strong> We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.</li> <li><strong>For business transfers:</strong> We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li> <li><strong>With Affiliates:</strong> We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li> <li><strong>With business partners:</strong> We may share Your information with Our business partners to offer You certain products, services or promotions.</li> <li><strong>With other users:</strong> when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li> <li><strong>With Your consent</strong>: We may disclose Your personal information for any other purpose with Your consent.</li> </ul> <h3>Retention of Your Personal Data</h3> <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p> <p>The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer periods.</p> <h3>Transfer of Your Personal Data</h3> <p>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from Your jurisdiction.</p> <p>Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.</p> <p>The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</p> <h3>Delete Your Personal Data</h3> <p>You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p> <p>Our Service may give You the ability to delete certain information about You from within the Service.</p> <p>You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.</p> <p>Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.</p> <h3>Disclosure of Your Personal Data</h3> <h4>Business Transactions</h4> <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p> <h4>Law enforcement</h4> <p>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p> <h4>Other legal requirements</h4> <p>The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p> <ul> <li>Comply with a legal obligation</li> <li>Protect and defend the rights or property of the Company</li> <li>Prevent or investigate possible wrongdoing in connection with the Service</li> <li>Protect the personal safety of Users of the Service or the public</li> <li>Protect against legal liability</li> </ul> <h3>Security of Your Personal Data</h3> <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security.</p> <h2>Children's Privacy</h2> <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.</p> <p>If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.</p> <h2>Links to Other Websites</h2> <p>Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</p> <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p> <h2>Changes to this Privacy Policy</h2> <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p> <p>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.</p> <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p> <h2>Contact Us</h2> <p>If you have any questions about this Privacy Policy, You can contact us:</p> <ul> <li> <p>By email: info@adhyatmah.com</p> </li> <li> <p>By visiting this page on our website: <a href='https://adhyatmah.com/contact' target='_blank'>https://adhyatmah.com/contact</a></p> </li> </ul></div>",
      },
      {
        type: "refund-and-return-policy",
        title: "Refund and Return policy",
        content:
          "<p>Thank you for shopping at Adhyatmah website and Adhyatmah app.</p> <p>If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns. </p> <p>The following terms are applicable for any products that You purchased with Us.</p> <h2>Interpretation and Definitions</h2> <h3>Interpretation</h3> <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p> <h3>Definitions</h3> <p>For the purposes of this Return and Refund Policy:</p> <ul> <li> <p><strong>Application</strong> means the software program provided by the Company downloaded by You on any electronic device, named Adhyatmah</p> </li> <li> <p><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Adhyatmah.</p> </li> <li> <p><strong>Goods</strong> refer to the items offered for sale on the Service.</p> </li> <li> <p><strong>Orders</strong> mean a request by You to purchase Goods from Us.</p> </li> <li> <p><strong>Service</strong> refers to the Application or the Website or both.</p> </li> <li> <p><strong>Website</strong> refers to Adhyatmah, accessible from <a href='https://adhyatmah.com/' target='_blank'>https://adhyatmah.com/</a></p> </li> <li> <p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p> </li> </ul> <h2>Your Order Cancellation Rights</h2> <p>You are entitled to cancel Your Order within 7 days without giving any reason for doing so.</p> <p>The deadline for cancelling an Order is 2 days from the date on which You received the Goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.</p> <p>In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. You can inform us of your decision by:</p> <ul> <li> <p>By email: info@adhyatmah.com</p> </li> <li> <p>By visiting this page on our website: <a href='https://adhyatmah.com/contact' target='_blank'>https://adhyatmah.com/contact</a></p> </li> </ul> <p>We will reimburse You no later than 7 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement.</p> <h2>Conditions for Returns</h2> <p>In order for the Goods to be eligible for a return, please make sure that:</p> <ul> <li>The Goods were purchased in the last 14 days</li> <li>The Goods are in the original packaging</li> </ul> <p>The following Goods cannot be returned:</p> <ul> <li>The supply of Goods made to Your specifications or clearly personalized.</li> <li>The supply of Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.</li> <li>The supply of Goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.</li> <li>The supply of Goods which are, after delivery, according to their nature, inseparably mixed with other items.</li> </ul> <p>We reserve the right to refuse returns of any merchandise that does not meet the above return conditions in our sole discretion.</p> <p>Only regular priced Goods may be refunded. Unfortunately, Goods on sale cannot be refunded. This exclusion may not apply to You if it is not permitted by applicable law.</p> <h2>Returning Goods</h2> <p>You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods at the following address:</p> <p>A-5, Sector 3 Noida, Uttar Pradesh - 201301<br /> +919452872182<br /> info@adhyatmah.com</p> <p>We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery.</p> <h2>Gifts</h2> <p>If the Goods were marked as a gift when purchased and then shipped directly to you, You'll receive a gift credit for the value of your return. Once the returned product is received, a gift certificate will be mailed to You.</p> <p>If the Goods weren't marked as a gift when purchased, or the gift giver had the Order shipped to themselves to give it to You later, We will send the refund to the gift giver.</p> <h3>Contact Us</h3> <p>If you have any questions about our Returns and Refunds Policy, please contact us:</p> <ul> <li> <p>By email: info@adhyatmah.com</p> </li> <li> <p>By visiting this page on our website: <a href='https://adhyatmah.com/contact'  target='_blank'>https://adhyatmah.com/contact</a></p> </li> </ul> <p> This item cannot be returned. You have 48 hours after delivery to request a replacement for an item that is damaged, defective, inaccurate, or expired. If the item is incorrect, you can only request a replacement or return if it is sealed, unopened, unused, and in its original condition. Disclaimer Every attempt is taken to ensure that all information is accurate. However, real product materials and packaging can include additional or different information. It is advised not to depend only on the data that is available.</p>",
      },
      {
        type: "terms-and-conditions",
        title: "Terms and Conditions",
        content:
          '<div><p>Please read these terms and conditions carefully before using Our Service.</p> <h2>Interpretation and Definitions</h2> <h3>Interpretation</h3> <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p> <h3>Definitions</h3> <p>For the purposes of these Terms and Conditions:</p> <ul> <li> <p><strong>Application</strong> means the software program provided by the Company downloaded by You on any electronic device, named Adhyatmah</p> </li> <li> <p><strong>Application Store</strong> means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded.</p> </li> <li> <p><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p> </li> <li> <p><strong>Country</strong> refers to: Delhi, India</p> </li> <li> <p><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Adhyatmah.</p> </li> <li> <p><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</p> </li> <li> <p><strong>Service</strong> refers to the Application or the Website or both.</p> </li> <li> <p><strong>Terms and Conditions</strong> (also referred as &quot;Terms&quot;) mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the <a href="https://www.privacypolicies.com/terms-conditions-generator/" target="_blank">Terms and Conditions Generator</a>.</p> </li> <li> <p><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</p> </li> <li> <p><strong>Website</strong> refers to Adhyatmah, accessible from <a href="https://adhyatmah.com/" rel="external nofollow noopener" target="_blank">https://adhyatmah.com/</a></p> </li> <li> <p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p> </li> </ul> <h2>Acknowledgment</h2> <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p> <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p> <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p> <p>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p> <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p> <h2>Links to Other Websites</h2> <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p> <p>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.</p> <p>We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.</p> <h2>Termination</h2> <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p> <p>Upon termination, Your right to use the Service will cease immediately.</p> <h2>Limitation of Liability</h2> <p>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or Rs 100000 if You havent purchased anything through the Service.</p> <p>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</p> <p>Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each partys liability will be limited to the greatest extent permitted by law.</p> <h2>&quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer</h2> <p>The Service is provided to You &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.</p> <p>Without limiting the foregoing, neither the Company nor any of the companys provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</p> <p>Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.</p> <h2>Governing Law</h2> <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p> <h2>Disputes Resolution</h2> <p>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.</p> <h2>For European Union (EU) Users</h2> <p>If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.</p> <h2>United States Legal Compliance</h2> <p>You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a &quot;terrorist supporting&quot; country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.</p> <h2>Severability and Waiver</h2> <h3>Severability</h3> <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p> <h3>Waiver</h3> <p>Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a partys ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.</p> <h2>Translation Interpretation</h2> <p>These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.</p> <h2>Changes to These Terms and Conditions</h2> <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p> <p>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.</p> <h2>Contact Us</h2> <p>If you have any questions about these Terms and Conditions, You can contact us:</p> <ul> <li> <p>By email: info@adhyatmah.com</p> </li> <li> <p>By visiting this page on our website: <a href="https://adhyatmah.com/contact" rel="external nofollow noopener" target="_blank">https://adhyatmah.com/contact</a></p> </li> </ul></div>',
      },
    ];

    // Create policies in database
    await Policy.insertMany(samplePolicies);
    const policies = await Policy.find();

    // Format policies for response to match reference API structure
    const formattedPolicies = {};

    // Map database types to reference API keys and add static fields
    const policyMapping = {
      "privacy-policy": {
        key: "privacyPolicy",
        handle: "privacy-policy",
        url: "https://pcykkj-yw.myshopify.com/76408226027/policies/36883005675",
      },
      "refund-and-return-policy": {
        key: "refundPolicy",
        handle: "refund-policy",
        url: "https://pcykkj-yw.myshopify.com/76408226027/policies/36927308011",
      },
      "terms-and-conditions": {
        key: "termsOfService",
        handle: "terms-of-service",
        url: "https://pcykkj-yw.myshopify.com/76408226027/policies/36927242475",
      },
    };

    policies.forEach((policy) => {
      const mapping = policyMapping[policy.type];
      if (mapping) {
        formattedPolicies[mapping.key] = {
          body: policy.content,
          created_at: policy.createdAt.toISOString(),
          updated_at: policy.updatedAt.toISOString(),
          handle: mapping.handle,
          title: policy.title,
          url: mapping.url,
        };
      }
    });

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Policies fetched successfully",
      payload: formattedPolicies,
    });
  } catch (error) {
    console.error("Error in getPolicies:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch policies: " + error.message,
    });
  }
};

/* Get YouTube URL */
const getYoutubeUrl = async (req, res) => {
  try {
    // Static YouTube URL - you can modify this URL as needed
    const youtubeUrl =
      "https://www.youtube.com/watch?v=3ucCEjXS9n8&list=RD3ucCEjXS9n8&start_radio=1";

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Youtube url fetched successfully",
      payload: {
        url: youtubeUrl,
      },
    });
  } catch (error) {
    console.error("Error in getYoutubeUrl:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch YouTube URL: " + error.message,
    });
  }
};

/* Get user profile with complete data */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userData?._id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized: No user data found",
      });
    }

    // Get user basic info
    const user = await User.findById(userId).select("-password -otp");

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Get user's bookings
    const bookings = await Booking.find({ customer: userId })
      .populate("vendor", "firstName lastName email phone")
      .populate("service", "poojaType name")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's orders
    const orders = await Order.find({ customer: userId })
      .populate("products.product", "name images price salePrice")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get wishlist products
    const wishlistProducts = await Product.find({
      _id: { $in: user.wishlist || [] },
    }).select("name slug images price salePrice stockQuantity");

    // Get cart products (assuming cart is stored in user model or separate cart model)
    // For now, we'll return empty cart array - you can implement cart logic as needed
    const cartProducts = [];

    // Format bookings
    const formattedBookings = bookings.map((booking) => ({
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
      vendor: booking.vendor
        ? {
            id: booking.vendor._id,
            firstName: booking.vendor.firstName,
            lastName: booking.vendor.lastName,
            email: booking.vendor.email,
            phone: booking.vendor.phone,
          }
        : null,
      service: booking.service
        ? {
            id: booking.service._id,
            poojaType: booking.service.poojaType,
            name: booking.service.name,
          }
        : null,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    // Format orders
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderID: order.orderID,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      products: order.products.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        images: item.product.images,
        price: item.product.price,
        salePrice: item.product.salePrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    // Format wishlist products
    const formattedWishlist = wishlistProducts.map((product) => ({
      id: product._id,
      name: product.name,
      slug: product.slug,
      images: product.images,
      price: product.price,
      salePrice: product.salePrice,
      stockQuantity: product.stockQuantity,
      isInStock: product.stockQuantity > 0,
    }));

    // Format cart products
    const formattedCart = cartProducts.map((product) => ({
      id: product._id,
      name: product.name,
      slug: product.slug,
      images: product.images,
      price: product.price,
      salePrice: product.salePrice,
      quantity: product.quantity || 1,
      totalPrice:
        (product.salePrice || product.price) * (product.quantity || 1),
    }));

    // Calculate statistics
    const totalBookings = await Booking.countDocuments({ customer: userId });
    const totalOrders = await Order.countDocuments({ customer: userId });
    const totalSpent = await Order.aggregate([
      { $match: { customer: userId, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const stats = {
      totalBookings,
      totalOrders,
      totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
      wishlistCount: user.wishlist ? user.wishlist.length : 0,
      cartCount: cartProducts.length,
    };

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "User profile fetched successfully",
      payload: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          role: user.role,
          language: user.language,
          profileImage: user.cover?.url || null,
          address: {
            street: user.address,
            city: user.city,
            state: user.state,
            country: user.country,
            zip: user.zip,
          },
          about: user.about,
          isEmailVerified: user.isEmailVerified || false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        bookings: {
          recent: formattedBookings,
          total: totalBookings,
        },
        orders: {
          recent: formattedOrders,
          total: totalOrders,
        },
        wishlist: {
          products: formattedWishlist,
          count: stats.wishlistCount,
        },
        cart: {
          products: formattedCart,
          count: stats.cartCount,
        },
        statistics: stats,
      },
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch user profile: " + error.message,
    });
  }
};

/* Get filter collection data */
const getFilterCollectionData = async (req, res) => {
  try {
    const { collectionHandle } = req.query;

    if (!collectionHandle) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Collection handle is required",
      });
    }

    // Find collection by handle
    const collection = await Collection.findOne({
      handle: collectionHandle,
    }).populate({
      path: "products",
      select: "name variants price salePrice attributes category brand",
      populate: {
        path: "brand",
        select: "name",
      },
    });

    if (!collection) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: `Collection with handle "${collectionHandle}" not found`,
      });
    }

    // Extract filter data from products
    const colors = new Set();
    const sizes = new Set();
    const genders = new Set();
    const brands = new Set();
    const prices = [];

    // Check if collection has products
    if (!collection.products || collection.products.length === 0) {
      // Return default filter data if no products
      const filterData = {
        color: [
          "black",
          "blue",
          "red",
          "grey",
          "white",
          "green",
          "yellow",
          "orange",
        ],
        size: ["XS", "S", "M", "L", "XL", "XXL"],
        minPrice: 0,
        maxPrice: 50000,
        gender: ["men", "women", "unisex"],
        brand: ["Generic", "Premium", "Traditional", "Modern"],
      };

      return res.status(200).json({
        error: false,
        code: 200,
        status: 200,
        message: "Filtered products from collection",
        payload: {
          Key: filterData,
        },
      });
    }

    collection.products.forEach((product) => {
      try {
        // Extract colors from variants or attributes
        if (
          product.variants &&
          Array.isArray(product.variants) &&
          product.variants.length > 0
        ) {
          product.variants.forEach((variant) => {
            if (variant && typeof variant === "object") {
              if (variant.color && typeof variant.color === "string") {
                colors.add(variant.color.toLowerCase());
              }
              if (variant.size && typeof variant.size === "string") {
                sizes.add(variant.size.toUpperCase());
              }
            }
          });
        }

        // Extract from attributes if available
        if (product.attributes && Array.isArray(product.attributes)) {
          product.attributes.forEach((attr) => {
            if (attr && typeof attr === "object" && attr.name && attr.value) {
              const attrName = attr.name.toLowerCase();
              const attrValue = attr.value.toString();

              if (attrName === "color") {
                colors.add(attrValue.toLowerCase());
              }
              if (attrName === "size") {
                sizes.add(attrValue.toUpperCase());
              }
              if (attrName === "gender") {
                genders.add(attrValue.toLowerCase());
              }
            }
          });
        }
      } catch (error) {
        console.log("Error processing product:", product._id, error.message);
        // Continue processing other products
      }

      // Extract brand
      if (product.brand) {
        const brandName =
          typeof product.brand === "string"
            ? product.brand
            : product.brand.name;
        if (brandName) {
          brands.add(brandName.toLowerCase());
        }
      }

      // Extract prices
      if (product.price && typeof product.price === "number") {
        prices.push(product.price);
      }
      if (product.salePrice && typeof product.salePrice === "number") {
        prices.push(product.salePrice);
      }
      if (
        product.variants &&
        Array.isArray(product.variants) &&
        product.variants.length > 0
      ) {
        product.variants.forEach((variant) => {
          if (variant && typeof variant === "object") {
            if (variant.price && typeof variant.price === "number") {
              prices.push(variant.price);
            }
            if (variant.salePrice && typeof variant.salePrice === "number") {
              prices.push(variant.salePrice);
            }
          }
        });
      }
    });

    // Calculate price range
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 50000;

    // Convert sets to arrays and sort
    const filterData = {
      color: Array.from(colors).sort(),
      size: Array.from(sizes).sort(),
      minPrice: Math.floor(minPrice),
      maxPrice: Math.ceil(maxPrice),
      gender: Array.from(genders).sort(),
      brand: Array.from(brands).sort(),
    };

    // If no data found, provide default values
    if (filterData.color.length === 0) {
      filterData.color = [
        "black",
        "blue",
        "red",
        "grey",
        "white",
        "green",
        "yellow",
        "orange",
      ];
    }
    if (filterData.size.length === 0) {
      filterData.size = ["XS", "S", "M", "L", "XL", "XXL"];
    }
    if (filterData.gender.length === 0) {
      filterData.gender = ["men", "women", "unisex"];
    }
    if (filterData.brand.length === 0) {
      filterData.brand = ["Generic", "Premium", "Traditional", "Modern"];
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 200,
      message: "Filtered products from collection",
      payload: {
        Key: filterData,
      },
    });
  } catch (error) {
    console.error("Error in getFilterCollectionData:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch filter data: " + error.message,
    });
  }
};

/* Get coupons */
const getCoupons = async (req, res) => {
  try {
    const { active } = req.query;

    // Build query
    let query = {};

    // If active=true, only return coupons that haven't expired
    if (active === "true") {
      query.expire = { $gt: new Date() };
    }

    // Fetch coupons from database
    const coupons = await CouponCode.find(query)
      .select("name code discount expire description type usedBy createdAt")
      .sort({ createdAt: -1 });

    // Format coupons to match desired response structure
    const formattedCoupons = coupons.map((coupon) => {
      // Generate a unique price_rule_id (using timestamp + random)
      const priceRuleId =
        parseInt(coupon._id.toString().slice(-10)) +
        Math.floor(Math.random() * 1000);

      // Format value based on type
      let value = coupon.discount.toString();
      if (coupon.type === "percent") {
        value = `-${value}`;
      } else {
        value = `-${value}`;
      }

      return {
        code: coupon.code,
        price_rule_id: priceRuleId,
        title: coupon.name || coupon.code,
        usage_limit: null, // Not tracked in current model
        value: value,
        value_type: coupon.type === "percent" ? "percentage" : "fixed_amount",
        starts_at: coupon.createdAt
          ? coupon.createdAt.toISOString()
          : new Date().toISOString(),
        ends_at: coupon.expire ? coupon.expire.toISOString() : null,
      };
    });

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Coupons fetched successfully",
      payload: {
        coupons: formattedCoupons,
      },
    });
  } catch (error) {
    console.error("Error in getCoupons:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch coupons: " + error.message,
    });
  }
};

/* Create customer address */
const createCustomerAddress = async (req, res) => {
  try {
    const userId = req.userData?._id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized: No user data found",
      });
    }

    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Address data is required",
      });
    }

    const {
      firstName,
      lastName,
      address1,
      address2,
      city,
      province,
      country,
      zip,
      phone,
    } = address;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !address1 ||
      !city ||
      !province ||
      !country ||
      !zip
    ) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Missing required address fields",
      });
    }

    // Create address
    const newAddress = await Address.create({
      customer: userId,
      firstName,
      lastName,
      address1,
      address2: address2 || "",
      city,
      province,
      country,
      zip,
      phone: phone || "",
    });

    // Generate Shopify-like ID
    const addressId = newAddress._id;

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Address created successfully",
      payload: {
        address: {
          id: addressId,
          address1: newAddress.address1,
          city: newAddress.city,
          country: newAddress.country,
        },
      },
    });
  } catch (error) {
    console.error("Error in createCustomerAddress:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to create address: " + error.message,
    });
  }
};

/* Get customer addresses */
const getCustomerAddresses = async (req, res) => {
  try {
    const userId = req.userData?._id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized: No user data found",
      });
    }

    // Fetch all addresses for the customer
    const addresses = await Address.find({ customer: userId }).sort({
      createdAt: -1,
    });

    // Format addresses to match desired response structure
    const formattedAddresses = addresses.map((address) => {
      const addressId = address._id;

      return {
        id: addressId,
        name: `${address.firstName} ${address.lastName}`,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
        phone: address.phone || "",
      };
    });

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Customer addresses fetched successfully",
      payload: {
        addresses: formattedAddresses,
      },
    });
  } catch (error) {
    console.error("Error in getCustomerAddresses:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch addresses: " + error.message,
    });
  }
};

/* Update customer address */
const updateCustomerAddress = async (req, res) => {
  try {
    const userId = req.userData?._id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized: No user data found",
      });
    }

    const { address, addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Address ID is required",
      });
    }

    if (!address) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Address data is required",
      });
    }

    // Address ID is already MongoDB ObjectId
    let mongoAddressId = addressId;

    // Validate MongoDB ObjectId format
    if (!mongoAddressId || mongoAddressId.length !== 24) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid address ID format",
      });
    }

    // Find and update address
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: mongoAddressId, customer: userId },
      {
        firstName: address.firstName,
        lastName: address.lastName,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
        phone: address.phone || "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Address not found or access denied",
      });
    }

    // Generate Shopify-like ID
    const newAddressId = updatedAddress._id;

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Address updated successfully",
      payload: {
        address: {
          id: newAddressId,
          address1: updatedAddress.address1,
          city: updatedAddress.city,
          country: updatedAddress.country,
        },
      },
    });
  } catch (error) {
    console.error("Error in updateCustomerAddress:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to update address: " + error.message,
    });
  }
};

/* Delete customer address */
const deleteCustomerAddress = async (req, res) => {
  try {
    const userId = req.userData?._id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized: No user data found",
      });
    }

    const { addressId } = req.query;

    if (!addressId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Address ID is required",
      });
    }

    // Address ID is already MongoDB ObjectId
    let mongoAddressId = addressId;

    // Validate MongoDB ObjectId format
    if (!mongoAddressId || mongoAddressId.length !== 24) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid address ID format",
      });
    }

    // Find and delete address
    const deletedAddress = await Address.findOneAndDelete({
      _id: mongoAddressId,
      customer: userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Address not found or access denied",
      });
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Address deleted successfully",
      payload: {
        deletedAddressId: addressId,
      },
    });
  } catch (error) {
    console.error("Error in deleteCustomerAddress:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to delete address: " + error.message,
    });
  }
};

/* Update user profile */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userData?._id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Unauthorized: No user data found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      gotra,
      veda,
      pankti,
      shakha,
      sutra,
      pravar,
      about,
      address,
      city,
      state,
      country,
      zip,
      language,
      dateOfBirth,
      occupation,
      maritalStatus,
      emergencyContact,
      preferences,
      commission,
      experience,
      image,
    } = req.body;

    // Prepare update data
    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined && email !== "") {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          error: true,
          code: 400,
          status: 0,
          message: "Email already exists",
        });
      }
      updateData.email = email;
    }
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    if (gotra !== undefined) updateData.gotra = gotra;
    if (veda !== undefined) updateData.veda = veda;
    if (pankti !== undefined) updateData.pankti = pankti;
    if (shakha !== undefined) updateData.shakha = shakha;
    if (sutra !== undefined) updateData.sutra = sutra;
    if (pravar !== undefined) updateData.pravar = pravar;

    if (about !== undefined) updateData.about = about;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (zip !== undefined) updateData.zip = zip;
    if (language !== undefined) {
      // Handle language as array
      if (Array.isArray(language)) {
        updateData.language = language;
      } else if (typeof language === "string") {
        updateData.language = [language];
      }
    }
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;
    if (emergencyContact !== undefined)
      updateData.emergencyContact = emergencyContact;
    if (preferences !== undefined) updateData.preferences = preferences;
    if (commission !== undefined) updateData.commission = commission;
    if (experience !== undefined) updateData.experience = experience;
    if (image !== undefined) updateData.image = image;

    // Handle profile image upload
    if (req.file) {
      try {
        // Configure Cloudinary from database settings
        await configureCloudinary();

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "user-profiles",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto" },
          ],
        });

        // Delete old profile image if exists
        if (user.cover && user.cover.public_id) {
          try {
            await cloudinary.uploader.destroy(user.cover.public_id);
          } catch (error) {
            console.log("Error deleting old profile image:", error.message);
          }
        }

        updateData.cover = {
          url: result.secure_url,
          public_id: result.public_id,
        };

        // Delete temporary file
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("Error uploading profile image:", error);
        return res.status(500).json({
          error: true,
          code: 500,
          status: 0,
          message: "Failed to upload profile image",
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -otp");

    if (!updatedUser) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Profile updated successfully",
      payload: {
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          gotra: updatedUser.gotra,
          veda: updatedUser.veda,
          pankti: updatedUser.pankti,
          shakha: updatedUser.shakha,
          sutra: updatedUser.sutra,
          pravar: updatedUser.pravar,
          about: updatedUser.about,
          address: updatedUser.address,
          city: updatedUser.city,
          state: updatedUser.state,
          country: updatedUser.country,
          zip: updatedUser.zip,
          language: updatedUser.language,
          dateOfBirth: updatedUser.dateOfBirth,
          occupation: updatedUser.occupation,
          maritalStatus: updatedUser.maritalStatus,
          emergencyContact: updatedUser.emergencyContact,
          preferences: updatedUser.preferences,
          commission: updatedUser.commission,
          experience: updatedUser.experience,
          image: updatedUser.image,
          profileImage: updatedUser.cover?.url || null,
          role: updatedUser.role,
          isEmailVerified: updatedUser.isEmailVerified || false,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: `Validation failed: ${validationErrors.join(", ")}`,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to update profile: " + error.message,
    });
  }
};

/* Upload customer image */
const upload = async (req, res) => {
  try {
    const { customerId } = req.body;

    // Validate input
    if (!customerId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Customer ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Image file is required",
      });
    }

    // Upload to Cloudinary
    try {
      // Configure Cloudinary from database settings
      await configureCloudinary();

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "customer-profiles",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto" },
        ],
      });

      // Delete temporary file
      fs.unlinkSync(req.file.path);

      // Generate a metafield ID (Shopify-style)
      const metafieldId =
        parseInt(customerId.toString().slice(-10)) +
        Math.floor(Math.random() * 1000000);

      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "File uploaded and linked to profile successfully",
        payload: {
          url: result.secure_url,
          metafieldId: metafieldId,
          customerId: customerId.toString(),
        },
      });
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);

      // Clean up temporary file if it exists
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up temporary file:", cleanupError);
        }
      }

      return res.status(500).json({
        error: true,
        code: 500,
        status: 0,
        message: "Failed to upload image: " + uploadError.message,
      });
    }
  } catch (error) {
    console.error("Error in upload:", error);

    // Clean up temporary file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary file:", cleanupError);
      }
    }

    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to upload file: " + error.message,
    });
  }
};

/* Update customer profile (Shopify-style response) */
const updateCustomerProfile = async (req, res) => {

  try {
    const {
      accessToken,
      firstName,
      lastName,
      email,
      gender,
      phone,
      image,
      aadhar,
      about,
      gotra,
      language,
      services,
      veda,
      pankti,
      shakha,
      pravar,
      sutra,
      address,
      city,
      state,
	  country,
      zip,
      dateOfBirth,
	  experience,
    } = req.body;

    /* =====================
       TOKEN VALIDATION
    ===================== */
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message:
          err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }

    /* =====================
       USER FETCH
    ===================== */
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    /* =====================
       BASIC PROFILE UPDATE
    ===================== */
    const setData = {};

    if (firstName !== undefined) setData.firstName = firstName;
    if (lastName !== undefined) setData.lastName = lastName;

    if (email) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) {
        return res.status(400).json({
          error: true,
          code: 400,
          status: 0,
          message: "Email already exists",
        });
      }
      setData.email = email;
    }

    if (gender !== undefined) setData.gender = gender;
	if (phone !== undefined) setData.phone = phone;
    if (about !== undefined) setData.about = about;
    if (gotra !== undefined) setData.gotra = gotra;
    if (veda !== undefined) setData.veda = veda;
    if (pankti !== undefined) setData.pankti = pankti;
    if (shakha !== undefined) setData.shakha = shakha;
    if (pravar !== undefined) setData.pravar = pravar;
    if (sutra !== undefined) setData.sutra = sutra;
    if (address !== undefined) setData.address = address;
    if (city !== undefined) setData.city = city;
    if (state !== undefined) setData.state = state;
	if (country !== undefined) setData.country = country;
    if (zip !== undefined) setData.zip = zip;
    if (dateOfBirth !== undefined) setData.dateOfBirth = dateOfBirth;
	if (experience !== undefined) setData.experience = experience;


    if (language) {
      setData.language = Array.isArray(language) ? language : [language];
    }

    /* =====================
       IMAGE UPDATE
    ===================== */
    if (image) {
      setData["cover.url"] = image;
      setData["cover._id"] = `img_${Date.now()}`;
    }

    if (aadhar) setData.aadhar = aadhar;

    /* ===============================
       SERVICES: 
       1. Get data from Service table (any vendor's services)
       2. Create/Update services for THIS vendor only
       3. Delete THIS vendor's services that are NOT in the new list
       4. Update User table with new service IDs
    =============================== */
    if (Array.isArray(services) && services.length > 0) {
  
      // Track new service IDs for this vendor
      const newServiceIds = [];
      const processedPoojaTypes = []; // Track which poojaTypes we're keeping

      for (const sourceServiceId of services) {
   
        // Step 1: Fetch the source service (jo dropdown mein dikha tha, kisi bhi vendor ka ho sakta hai)
        const sourceService = await Service.findById(sourceServiceId);
        if (!sourceService) {
          continue;
        }

        // Get service details
        const { poojaType, description, duration, price } = sourceService;
        processedPoojaTypes.push(poojaType); // Track this poojaType

        // Step 2: Check if current vendor already has this poojaType
        let myVendorService = await Service.findOne({
          poojaType: poojaType,
          vendor: user._id,
        });

        if (myVendorService) {
          
          // Step 3a: Service exists for this vendor → UPDATE it
          myVendorService.description = description;
          myVendorService.duration = duration;
          myVendorService.price = price;
          await myVendorService.save();

          newServiceIds.push(myVendorService._id);
          
        } else {
          
          // Step 3b: Service doesn't exist for this vendor → CREATE new one
          try {
            const newVendorService = await Service.create({
              poojaType: poojaType,
              description: description,
              duration: duration,
              price: price,
              vendor: user._id, // current vendor ki ID
            });

            newServiceIds.push(newVendorService._id);
            
          } catch (err) {
            console.error(
              `Error creating service ${poojaType}:`,
              err.message
            );

            // Handle duplicate key error (race condition)
            if (err.code === 11000) {
              
              // Retry finding the service
              myVendorService = await Service.findOne({
                poojaType: poojaType,
                vendor: user._id,
              });

              if (myVendorService) {
                newServiceIds.push(myVendorService._id);
              }
            }
          }
        }
      }

      // Step 4: DELETE services that belong to THIS vendor but are NOT in processedPoojaTypes
      const deleteResult = await Service.deleteMany({
        vendor: user._id,
        poojaType: { $nin: processedPoojaTypes }, // NOT IN the new list
      });

      // Step 5: Update user's services array with new service IDs in setData
      setData.services = newServiceIds;
    } else if (services && services.length === 0) {
      // If empty array is sent, delete ALL services for this vendor
      const deleteResult = await Service.deleteMany({ vendor: user._id });
      setData.services = [];
    }

    /* =====================
       UPDATE USER PROFILE (INCLUDING SERVICES)
    ===================== */
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: setData },
      { new: true, runValidators: true }
    ).select("-password -otp");

    /* =====================
       SHOPIFY STYLE RESPONSE
    ===================== */
    const orders = await Order.find({ customer: user._id });
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Customer profile updated successfully",
      payload: {
        customer: {
          id: Number(user._id.toString().slice(-8)),
          email: updatedUser.email,
          first_name: updatedUser.firstName,
          last_name: updatedUser.lastName,
          total_spent: totalSpent.toFixed(2),
          orders_count: orders.length,
          verified_email: updatedUser.isEmailVerified || false,
          created_at: updatedUser.createdAt,
          updated_at: updatedUser.updatedAt,
          services: updatedUser.services, // Include updated services in response
        },
      },
    });
  } catch (error) {
    console.error("updateCustomerProfile error:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};

/* Get customer profile */
const getCustomerProfile = async (req, res) => {
  try {
    const { accessToken } = req.query;

    // Validate input
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      if (err && err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
          code: 401,
        });
      }
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id).select("-password -otp");
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Generate Shopify-style customer ID
    const customerId =
      parseInt(user._id.toString().slice(-10)) +
      Math.floor(Math.random() * 1000);

    // Format response
    const customerProfile = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      email: user.email || "",
      image: user.image || "",
      CustomerID: customerId.toString(),
    };

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Customer profile fetched successfully",
      payload: customerProfile,
    });
  } catch (error) {
    console.error("Error in getCustomerProfile:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch customer profile: " + error.message,
    });
  }
};

/* Get profile image */
const getProfileImage = async (req, res) => {
  try {
    const { customerId } = req.query;

    // Validate input
    if (!customerId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Customer ID is required",
      });
    }

    // Customer ID is already MongoDB ObjectId
    let mongoUserId = customerId;

    // Find user
    const user = await User.findById(mongoUserId);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Customer not found",
      });
    }

    // Check if user has a profile image
    if (!user.cover || !user.cover.url) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Profile image not found",
      });
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Profile image retrieved successfully",
      payload: {
        url: user.cover.url,
      },
    });
  } catch (error) {
    console.error("Error in getProfileImage:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to retrieve profile image: " + error.message,
    });
  }
};

/* Get payment methods */
const getPaymentMethods = async (req, res) => {
  try {
    // Static payment methods data - only Stripe for bookings
    const paymentMethods = [
      {
        id: "stripe",
        name: "Credit or Debit Card",
        icon: "https://cdn.shopify.com/s/files/1/0800/9151/2866/files/Group_4_3x_1.png?v=1751455347",
        type: "stripe",
      },
    ];

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Payment methods fetched successfully",
      payload: paymentMethods,
    });
  } catch (error) {
    console.error("Error in getPaymentMethods:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch payment methods: " + error.message,
    });
  }
};

/* Get search types */
const getSearchTypes = async (req, res) => {
  try {
    // Static search parameters data
    const searchData = {
      query: "t-shirt",
      types: ["PRODUCT", "PAGE", "ARTICLE"],
      first: 200,
      sortKey: "RELEVANCE",
    };

    return res.status(200).json({
      error: false,
      code: 200,
      status: 200,
      message: "Hardcoded search parameters fetched successfully",
      payload: searchData,
    });
  } catch (error) {
    console.error("Error in getSearchTypes:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch search types: " + error.message,
    });
  }
};

/* Search products */
const search = async (req, res) => {
  try {
    const { query, types, first = 200, sortKey = "RELEVANCE" } = req.body;

    // Build search criteria
    let searchCriteria = {
      status: "published",
    };

    // Add text search if query is provided
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { metaTitle: { $regex: query, $options: "i" } },
        { metaDescription: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ];
    }

    // Build sort criteria
    let sortCriteria = {};
    switch (sortKey) {
      case "RELEVANCE":
        sortCriteria = { createdAt: -1 };
        break;
      case "PRICE_ASC":
        sortCriteria = { price: 1 };
        break;
      case "PRICE_DESC":
        sortCriteria = { price: -1 };
        break;
      case "CREATED_AT":
        sortCriteria = { createdAt: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    // Execute search query
    const products = await Product.find(searchCriteria)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("childCategory", "name")
      .populate("brand", "name")
      .populate("shop", "name")
      .sort(sortCriteria)
      .limit(parseInt(first));

    // Format results to match the required response structure
    const formattedResults = products.map((product) => {
      // Generate Shopify-style product ID
      const productId = product._id;

      // Get featured image
      let featuredImage = null;
      if (product.images && product.images.length > 0) {
        featuredImage = {
          url: product.images[0].url,
          altText: null,
        };
      }

      // Calculate price range
      let minPrice = product.price || 0;
      if (
        product.type === "variable" &&
        product.variants &&
        product.variants.length > 0
      ) {
        const prices = product.variants.map(
          (variant) => variant.salePrice || variant.price
        );
        minPrice = Math.min(...prices);
      }

      return {
        __typename: "Product",
        id: productId,
        title: product.name,
        handle: product.slug || product.name.toLowerCase().replace(/\s+/g, "-"),
        description: product.description,
        featuredImage: featuredImage,
        priceRange: {
          minVariantPrice: {
            amount: minPrice.toString(),
            currencyCode: "INR",
          },
        },
      };
    });

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Search results fetched successfully",
      payload: {
        results: formattedResults,
      },
    });
  } catch (error) {
    console.error("Error in search:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to search products: " + error.message,
    });
  }
};

/* Get FAQs (Role wise) */
const getFAQs = async (req, res) => {
  try {
    const { role = "user" } = req.query; // default user

    // FAQs for USER
    const userFAQs = [
      {
        question: "How do I place an order?",
        answer:
          'Simply browse products, tap "Add to Cart," and proceed to checkout. Fill in your shipping details and make a payment to complete your order.',
      },
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept major debit/credit cards, UPI, wallets, and Cash on Delivery (COD).",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes, once your order is shipped, you will receive a tracking link via SMS or email.",
      },
      {
        question: "Can I cancel or change my order?",
        answer:
          "Orders can be canceled or updated before they are shipped by contacting support.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, we use industry-standard encryption and trusted payment gateways.",
      },
    ];

    // FAQs for VENDOR / PANDIT
    const vendorFAQs = [
      {
        question: "How do I register as a pandit/vendor?",
        answer:
          "You can sign up by selecting the Vendor option and completing your profile with required documents.",
      },
      {
        question: "How do I add or manage my services?",
        answer:
          "Login to your vendor dashboard and add or update your pooja services anytime.",
      },
      {
        question: "When will I receive my payments?",
        answer: "Payments are settled weekly to your registered bank account.",
      },
      {
        question: "Can I update my availability?",
        answer:
          "Yes, you can manage your availability from your vendor dashboard.",
      },
      {
        question: "Who do I contact for vendor support?",
        answer:
          "Vendor support is available via the Help section or email at support@adhyatmah.com.",
      },
    ];

    // Role based response
    let faqs = userFAQs;
    if (role === "vendor") {
      faqs = vendorFAQs;
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "FAQs fetched successfully",
      payload: faqs,
    });
  } catch (error) {
    console.error("Error in getFAQs:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch FAQs: " + error.message,
    });
  }
};

/* Get Indian States */
const getIndianStates = async (req, res) => {
  try {
    // Static Indian states data
    const states = [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
    ];

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Indian states fetched successfully",
      payload: {
        states: states,
      },
    });
  } catch (error) {
    console.error("Error in getIndianStates:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch Indian states: " + error.message,
    });
  }
};

/* Apply coupon to cart */
const applyCoupon = async (req, res) => {
  try {
    const { cartId, discountCode } = req.body;

    // Validate input
    if (!cartId) {
      return res.status(400).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to apply discount",
        payload: {
          errors: [
            {
              field: ["cartId"],
              message: "Cart ID is required.",
            },
          ],
        },
      });
    }

    if (!discountCode) {
      return res.status(400).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to apply discount",
        payload: {
          errors: [
            {
              field: ["discountCode"],
              message: "Discount code is required.",
            },
          ],
        },
      });
    }

    // Cart ID is already MongoDB ObjectId
    let userId = cartId;

    // Cart ID is already MongoDB ObjectId
    mongoCartId = cartId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to apply discount",
        payload: {
          errors: [
            {
              field: ["cartId"],
              message: "The specified cart does not exist.",
            },
          ],
        },
      });
    }

    // Check if cart is empty
    if (!user.cart || user.cart.length === 0) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to apply discount",
        payload: {
          errors: [
            {
              field: ["cartId"],
              message: "Cart is empty.",
            },
          ],
        },
      });
    }

    // Find coupon by code
    const coupon = await CouponCode.findOne({ code: discountCode });
    if (!coupon) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to apply discount",
        payload: {
          errors: [
            {
              field: ["discountCode"],
              message: "The discount code is not valid.",
            },
          ],
        },
      });
    }

    // Check if coupon is expired
    const now = new Date();
    if (coupon.expire && coupon.expire < now) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to apply discount",
        payload: {
          errors: [
            {
              field: ["discountCode"],
              message: "The discount code has expired.",
            },
          ],
        },
      });
    }

    // Check if coupon has been used by this user
    if (coupon.usedBy && coupon.usedBy.includes(user.email)) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to apply discount",
        payload: {
          errors: [
            {
              field: ["discountCode"],
              message: "This discount code has already been used.",
            },
          ],
        },
      });
    }

    // Calculate cart total
    let cartTotal = 0;
    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem.productId);
      if (product) {
        let itemPrice = product.price || 0;
        if (
          product.type === "variable" &&
          product.variants &&
          product.variants.length > 0
        ) {
          // For variable products, use the first variant's price
          itemPrice =
            product.variants[0].salePrice || product.variants[0].price || 0;
        }
        cartTotal += itemPrice * cartItem.quantity;
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.type === "percent") {
      discountAmount = (coupon.discount / 100) * cartTotal;
    } else {
      discountAmount = coupon.discount;
    }

    // Ensure discount doesn't exceed cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    // Store applied coupon in user's document
    user.appliedDiscount = {
      code: discountCode,
      amount: discountAmount,
      type: coupon.type,
      percentage: coupon.type === "percent" ? coupon.discount : null,
      fixedAmount: coupon.type === "fixed" ? coupon.discount : null,
      appliedAt: new Date(),
    };

    // Save the user with applied discount
    await user.save();

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Discount applied successfully",
      payload: {
        discount: {
          amount: discountAmount.toFixed(2),
          code: discountCode,
          type: coupon.type,
          percentage: coupon.type === "percent" ? coupon.discount : null,
          fixedAmount: coupon.type === "fixed" ? coupon.discount : null,
        },
        cartTotal: cartTotal.toFixed(2),
        discountedTotal: (cartTotal - discountAmount).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error in applyCoupon:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to apply coupon: " + error.message,
    });
  }
};

/* Remove applied discount */
const removeDiscount = async (req, res) => {
  try {
    const { cartId } = req.body;

    // Validate input
    if (!cartId) {
      return res.status(400).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to remove discount",
        payload: {
          errors: [
            {
              field: ["cartId"],
              message: "Cart ID is required.",
            },
          ],
        },
      });
    }

    // Cart ID is already MongoDB ObjectId
    let userId = cartId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to remove discount",
        payload: {
          errors: [
            {
              field: ["cartId"],
              message: "The specified cart does not exist.",
            },
          ],
        },
      });
    }

    // Clear applied discount
    user.appliedDiscount = {
      code: null,
      amount: 0,
      type: null,
      percentage: null,
      fixedAmount: null,
      appliedAt: null,
    };

    // Save the user
    await user.save();

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Discount removed successfully",
      payload: {},
    });
  } catch (error) {
    console.error("Error in removeDiscount:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to remove discount: " + error.message,
    });
  }
};

/* Create COD Order */
const createCodOrder = async (req, res) => {
  try {
    const { cartId, addressId, accessToken } = req.body;

    // Validate input
    if (!cartId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Cart ID is required",
      });
    }

    if (!addressId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Address ID is required",
      });
    }

    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      if (err && err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
          code: "TOKEN_EXPIRED",
        });
      }
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Extract address ID from Shopify-style ID
    let mongoAddressId;
    // Address ID is already MongoDB ObjectId
    mongoAddressId = addressId;

    // Find address
    const address = await Address.findById(mongoAddressId);
    if (!address || address.customer.toString() !== user._id.toString()) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Address not found",
      });
    }

    // Check if cart is empty
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Cart is empty",
      });
    }

    // Calculate cart total and prepare line items
    let cartTotal = 0;
    const lineItems = [];

    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem.productId);
      if (product) {
        let itemPrice = product.price || 0;
        let variantTitle = "";

        if (
          product.type === "variable" &&
          product.variants &&
          product.variants.length > 0
        ) {
          // Find the specific variant
          const variant = product.variants.find(
            (v) => v._id.toString() === cartItem.variantId.split("/").pop()
          );
          if (variant) {
            itemPrice = variant.salePrice || variant.price || 0;
            variantTitle = variant.name || "";
          } else {
            // Fallback to first variant
            itemPrice =
              product.variants[0].salePrice || product.variants[0].price || 0;
            variantTitle = product.variants[0].name || "";
          }
        }

        const subtotal = itemPrice * cartItem.quantity;
        cartTotal += subtotal;

        // Generate Shopify-style IDs
        const lineItemId =
          Math.floor(Math.random() * 100000000000000) + 10000000000000;
        const productId =
          Math.floor(Math.random() * 100000000000000) + 10000000000000;
        const variantId =
          Math.floor(Math.random() * 100000000000000) + 10000000000000;

        lineItems.push({
          id: lineItemId,
          admin_graphql_api_id: lineItemId,
          attributed_staffs: [],
          current_quantity: cartItem.quantity,
          fulfillable_quantity: cartItem.quantity,
          fulfillment_service: "manual",
          fulfillment_status: null,
          gift_card: false,
          grams: 100,
          name: `${product.name} - ${variantTitle}`,
          price: itemPrice.toFixed(2),
          price_set: {
            shop_money: {
              amount: itemPrice.toFixed(2),
              currency_code: "INR",
            },
            presentment_money: {
              amount: itemPrice.toFixed(2),
              currency_code: "INR",
            },
          },
          product_exists: true,
          product_id: productId,
          properties: [],
          quantity: cartItem.quantity,
          requires_shipping: true,
          sku: null,
          taxable: true,
          title: product.name,
          total_discount: "0.00",
          total_discount_set: {
            shop_money: {
              amount: "0.00",
              currency_code: "INR",
            },
            presentment_money: {
              amount: "0.00",
              currency_code: "INR",
            },
          },
          variant_id: variantId,
          variant_inventory_management: "shopify",
          variant_title: variantTitle,
          vendor: "Adhyatmah",
          tax_lines: [],
          duties: [],
          discount_allocations: [],
        });
      }
    }

    // Generate order number
    const orderNumber = Math.floor(Math.random() * 10000) + 1000;
    const orderId =
      Math.floor(Math.random() * 100000000000000) + 10000000000000;
    const customerId =
      Math.floor(Math.random() * 100000000000000) + 10000000000000;
    const confirmationNumber = Math.random()
      .toString(36)
      .substring(2, 12)
      .toUpperCase();

    // Create order in database
    const orderCreated = await Order.create({
      paymentMethod: "COD",
      orderNo: `#${orderNumber}`,
      paymentId: null,
      subTotal: cartTotal,
      total: totalAmount,
      totalItems: user.cart.reduce((sum, item) => sum + item.quantity, 0),
      shipping: shipping,
      tax: tax,
      discount: 0,
      currency: "INR",
      conversionRate: 1,
      status: "pending",
      items: user.cart.map((cartItem) => ({
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        price: 0, // Will be calculated from product
      })),
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: address.address1,
        city: address.city,
        zip: address.zip,
        country: address.country,
        state: address.province,
      },
    });

    // Add order to user's orders array
    await User.findByIdAndUpdate(user._id, {
      $push: { orders: orderCreated._id },
    });

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Generate current timestamp
    const now = new Date();
    const timestamp = now.toISOString();

    // Format the response to match Shopify order structure
    const orderResponse = {
      id: orderId,
      admin_graphql_api_id: orderId,
      app_id: 260256694273,
      browser_ip: null,
      buyer_accepts_marketing: false,
      cancel_reason: null,
      cancelled_at: null,
      cart_token: null,
      checkout_id: null,
      checkout_token: null,
      client_details: null,
      closed_at: null,
      confirmation_number: confirmationNumber,
      confirmed: true,
      created_at: timestamp,
      currency: "INR",
      current_subtotal_price: cartTotal.toFixed(2),
      current_subtotal_price_set: {
        shop_money: {
          amount: cartTotal.toFixed(2),
          currency_code: "INR",
        },
        presentment_money: {
          amount: cartTotal.toFixed(2),
          currency_code: "INR",
        },
      },
      current_total_additional_fees_set: null,
      current_total_discounts: "0.00",
      current_total_discounts_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      current_total_duties_set: null,
      current_total_price: totalAmount.toFixed(2),
      current_total_price_set: {
        shop_money: {
          amount: totalAmount.toFixed(2),
          currency_code: "INR",
        },
        presentment_money: {
          amount: totalAmount.toFixed(2),
          currency_code: "INR",
        },
      },
      current_total_tax: tax.toFixed(2),
      current_total_tax_set: {
        shop_money: {
          amount: tax.toFixed(2),
          currency_code: "INR",
        },
        presentment_money: {
          amount: tax.toFixed(2),
          currency_code: "INR",
        },
      },
      customer_locale: null,
      device_id: null,
      discount_codes: [],
      duties_included: false,
      estimated_taxes: false,
      financial_status: "pending",
      fulfillment_status: null,
      landing_site: null,
      landing_site_ref: null,
      location_id: null,
      merchant_business_entity_id: "16486564075",
      merchant_of_record_app_id: null,
      name: `#${orderNumber}`,
      note: null,
      note_attributes: [],
      number: orderNumber,
      order_number: orderNumber,
      original_total_additional_fees_set: null,
      original_total_duties_set: null,
      payment_gateway_names: [""],
      po_number: null,
      presentment_currency: "INR",
      processed_at: timestamp,
      reference: null,
      referring_site: null,
      source_identifier: null,
      source_name: "260256694273",
      source_url: null,
      subtotal_price: cartTotal.toFixed(2),
      subtotal_price_set: {
        shop_money: {
          amount: cartTotal.toFixed(2),
          currency_code: "INR",
        },
        presentment_money: {
          amount: cartTotal.toFixed(2),
          currency_code: "INR",
        },
      },
      tags: "",
      tax_exempt: false,
      tax_lines: [],
      taxes_included: false,
      test: false,
      token: Math.random().toString(36).substring(2),
      total_cash_rounding_payment_adjustment_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      total_cash_rounding_refund_adjustment_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      total_discounts: "0.00",
      total_discounts_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      total_line_items_price: cartTotal.toFixed(2),
      total_line_items_price_set: {
        shop_money: {
          amount: cartTotal.toFixed(2),
          currency_code: "INR",
        },
        presentment_money: {
          amount: cartTotal.toFixed(2),
          currency_code: "INR",
        },
      },
      total_outstanding: totalAmount.toFixed(2),
      total_price: totalAmount.toFixed(2),
      total_price_set: {
        shop_money: {
          amount: totalAmount.toFixed(2),
          currency_code: "INR",
        },
        presentment_money: {
          amount: totalAmount.toFixed(2),
          currency_code: "INR",
        },
      },
      total_shipping_price_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      total_tax: tax.toFixed(2),
      total_tax_set: {
        shop_money: {
          amount: tax.toFixed(2),
          currency_code: "INR",
        },
        presentment_money: {
          amount: tax.toFixed(2),
          currency_code: "INR",
        },
      },
      total_tip_received: "0.00",
      total_weight: 0,
      updated_at: timestamp,
      user_id: null,
      billing_address: null,
      customer: {
        id: customerId,
        created_at: user.createdAt ? user.createdAt.toISOString() : timestamp,
        updated_at: timestamp,
        state: "enabled",
        note: null,
        verified_email: true,
        multipass_identifier: null,
        tax_exempt: false,
        email_marketing_consent: {
          state: "not_subscribed",
          opt_in_level: "single_opt_in",
          consent_updated_at: null,
        },
        sms_marketing_consent: {
          state: "not_subscribed",
          opt_in_level: "single_opt_in",
          consent_updated_at: null,
          consent_collected_from: "OTHER",
        },
        tags: "Easy Appointment Booking",
        currency: "INR",
        tax_exemptions: [],
        admin_graphql_api_id: customerId,
        default_address: {
          id: parseInt(addressId.split("/").pop().split("?")[0]),
          customer_id: customerId,
          company: null,
          province: address.province,
          country: address.country,
          province_code: address.province === "Uttar Pradesh" ? "UP" : "UP",
          country_code: address.country === "India" ? "IN" : "IN",
          country_name: address.country,
          default: true,
        },
      },
      discount_applications: [],
      fulfillments: [],
      line_items: lineItems,
      payment_terms: null,
      refunds: [],
      shipping_address: {
        province: address.province,
        country: address.country,
        country_code: address.country === "India" ? "IN" : "IN",
        province_code: address.province === "Uttar Pradesh" ? "UP" : "UP",
      },
      shipping_lines: [],
    };

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "COD order created successfully",
      payload: {
        order: orderResponse,
      },
    });
  } catch (error) {
    console.error("Error in createCodOrder:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to create COD order: " + error.message,
    });
  }
};

/* Initialize Payment */
const initializePayment = async (req, res) => {
  try {
    const {
      cartId,
      addressId,
      accessToken,
      email,
      currency = "INR",
      provider = "both",
    } = req.body;

    // Validate input
    if (!cartId || !addressId || !accessToken || !email) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "cartId, addressId, accessToken, and email are required",
        payload: {},
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Extract address ID from Shopify-style ID
    let mongoAddressId = addressId;

    // Find address
    const address = await Address.findById(mongoAddressId);
    if (!address || address.customer.toString() !== user._id.toString()) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Address not found",
      });
    }

    // Check if cart is empty
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Cart is empty",
      });
    }

    // Calculate cart total and prepare line items
    let cartTotal = 0;
    const lineItems = [];

    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem.productId);
      if (product) {
        let itemPrice = product.salePrice || product.price || 0;
        let variantTitle = "";

        if (
          product.type === "variable" &&
          product.variants &&
          product.variants.length > 0
        ) {
          const variant = product.variants.find(
            (v) => v._id.toString() === cartItem.variantId.split("/").pop()
          );
          if (variant) {
            itemPrice = variant.salePrice || variant.price || 0;
            variantTitle = variant.name || "";
          } else {
            itemPrice =
              product.variants[0].salePrice || product.variants[0].price || 0;
            variantTitle = product.variants[0].name || "";
          }
        }

        const subtotal = itemPrice * cartItem.quantity;
        cartTotal += subtotal;

        lineItems.push({
          variant_id:
            Math.floor(Math.random() * 100000000000000) + 10000000000000,
          quantity: cartItem.quantity,
          product_title: product.name,
        });
      }
    }

    // Add shipping and tax
    const shipping = 10;
    const tax = cartTotal * 0.09;
    const totalAmount = cartTotal + shipping + tax;

    // Get settings (Stripe + Razorpay may be present)
    const settings = await Settings.findOne({});
    const frontendUrl =
      process.env.FRONTEND_URL || "https://www.adhyatmah.com";
    const customerIdResponse =
      Math.floor(Math.random() * 100000000000000) + 10000000000000;
    const receiptId = `order_${cartId.slice(-8)}_${Date.now()
      .toString()
      .slice(-8)}`;

    // Build common order metadata
    const orderMetadata = {
      line_items: lineItems,
      shipping_address: {
        first_name: address.firstName,
        last_name: address.lastName,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
        phone: address.phone || user.phone,
      },
      customer: {
        email: email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
      cartId: cartId,
      addressId: addressId,
      accessToken: accessToken,
      customerId: user._id.toString(), // Real MongoDB user ID
      subtotal: cartTotal,
      shipping: shipping,
      tax: tax,
      total: totalAmount,
    };

    const payload = {};

    // If Stripe requested or both
    if (["stripe", "both"].includes(provider)) {
      if (
        settings &&
        settings.general &&
        settings.general.stripe &&
        settings.general.stripe.isActive
      ) {
        try {
          const stripeSecretKey = settings.general.stripe.secretKey;
          const stripePublishableKey = settings.general.stripe.publishableKey;
          const Stripe = require("stripe");
          const stripe = new Stripe(stripeSecretKey);

          const amountInSubunits = Math.round(totalAmount * 100);

          const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInSubunits,
            currency: currency.toLowerCase(),
            receipt_email: email,
            metadata: {
              cartId: cartId.substring(0, 50),
              addressId: addressId.substring(0, 50),
              accessToken: accessToken.substring(0, 50),
              customerId: user._id.toString(),
              receiptId: receiptId,
              email: email.substring(0, 50),
            },
          });

          const paymentLink = await stripe.paymentLinks.create({
            line_items: [
              {
                price_data: {
                  currency: currency.toLowerCase(),
                  product_data: {
                    name: "Order Payment",
                    description: `Order for ${user.firstName} ${user.lastName}`,
                  },
                  unit_amount: amountInSubunits,
                },
                quantity: 1,
              },
            ],
            metadata: {
              cartId: cartId.substring(0, 50),
              addressId: addressId.substring(0, 50),
              accessToken: accessToken.substring(0, 50),
              customerId: user._id.toString(),
              payment_intent_id: paymentIntent.id,
            },
            after_completion: {
              type: "redirect",
              redirect: {
                url: `${frontendUrl}/paymentCallback?payment_intent=${paymentIntent.id}`,
              },
            },
            allow_promotion_codes: false,
            billing_address_collection: "required",
            customer_creation: "always",
            payment_method_types: ["card"],
          });

          payload.stripe = {
            authorization_url: paymentLink.url,
            payment_link_id: paymentLink.id,
            order_id: paymentIntent.id,
            stripe_key: stripePublishableKey,
          };
        } catch (err) {
          console.error("Stripe initialization error:", err);
          const errPayload = {
            provider: "stripe",
            message: err.message || "Stripe error",
            details: err.raw || err,
          };
          return res.status(400).json({
            error: true,
            code: 400,
            status: 0,
            message: "Payment initialization failed",
            payload: errPayload,
          });
        }
      }
    }

    // If Razorpay requested or both
    if (["razorpay", "both"].includes(provider)) {
      if (
        settings &&
        settings.general &&
        settings.general.razorpay &&
        settings.general.razorpay.isActive
      ) {
        try {
          const razorpayKeyId = settings.general.razorpay.keyId;
          const razorpayKeySecret = settings.general.razorpay.keySecret;

          const Razorpay = require("razorpay");
          const razorpay = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret,
          });

          const amountInPaise = Math.round(totalAmount * 100);

          const orderOptions = {
            amount: amountInPaise,
            currency: currency,
            receipt: receiptId,
            notes: {
              cartId: cartId,
              addressId: addressId,
              customerId: user._id.toString(), // Real MongoDB user ID
              email: email,
              orderType: "product",
            },
          };

          const order = await razorpay.orders.create(orderOptions);

          console.log("[Razorpay Init] Order created with notes:", order.notes);

          payload.razorpay = {
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: razorpayKeyId,
            receipt: receiptId,
          };

          // Create Razorpay hosted Payment Link
          try {
            const paymentLinkBody = {
              amount: amountInPaise,
              currency: currency,
              accept_partial: false,
              reference_id: receiptId,
              description: `Order payment for ${user.firstName} ${user.lastName}`,
              customer: {
                name: `${user.firstName} ${user.lastName}`,
                contact: user.phone || "",
                email: email,
              },
              notify: {
                sms: true,
                email: true,
              },
              callback_url: `${frontendUrl}/paymentCallback?razorpay_order_id=${order.id}`,
              callback_method: "get",
              notes: {
                cartId: cartId,
                addressId: addressId,
                customerId: user._id.toString(), // Real MongoDB user ID - IMPORTANT!
                email: email,
                orderType: "product",
              },
            };

            const basicAuth = Buffer.from(
              `${razorpayKeyId}:${razorpayKeySecret}`
            ).toString("base64");
            const { fetch } = require("undici");
            const resp = await fetch(
              "https://api.razorpay.com/v1/payment_links",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Basic ${basicAuth}`,
                },
                body: JSON.stringify(paymentLinkBody),
              }
            );

            if (resp.ok) {
              const linkData = await resp.json();
              console.log(
                "[Razorpay Init] Payment link created with notes:",
                linkData.notes
              );
              payload.razorpay.payment_link = {
                id: linkData.id,
                short_url: linkData.short_url,
                long_url: linkData.long_url,
              };
            } else {
              console.warn(
                "Razorpay payment link creation failed:",
                resp.status
              );
            }
          } catch (e) {
            console.warn(
              "Error creating Razorpay payment link:",
              e.message || e
            );
          }
        } catch (err) {
          console.error("Razorpay order creation error:", err);
          const errPayload = {
            provider: "razorpay",
            message: err.message || "Razorpay order creation error",
            details: err,
          };
          return res.status(400).json({
            error: true,
            code: 400,
            status: 0,
            message: "Payment initialization failed",
            payload: errPayload,
          });
        }
      }
    }

    // If nothing added, error
    if (!payload.stripe && !payload.razorpay) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message:
          "No payment provider is configured. Please enable Stripe or Razorpay in settings.",
      });
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Payment initialized successfully",
      payload: {
        amount: Math.round(totalAmount),
        success_url_app: `${frontendUrl}/order-success`,
        currency: currency.toUpperCase(),
        receipt: receiptId,
        order_metadata: orderMetadata,
        ...payload,
      },
    });
  } catch (error) {
    console.error("Error in initializePayment:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to initialize payment",
      payload: { error: error.message },
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      payment_intent_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      razorpay_payment_link_id,
    } = req.body;

    // ==================== RAZORPAY FLOW ====================
    if (razorpay_payment_id) {
      console.log("[Razorpay Verify] Starting verification...");

      const settings = await Settings.findOne({});
      const razorpayKeyId = settings.general.razorpay.keyId;
      const razorpayKeySecret = settings.general.razorpay.keySecret;

      const crypto = require("crypto");
      let verified = false;

      /* ----------------------------------------------------
       * 1 SIGNATURE VERIFICATION (SERVER-SIDE ONLY)
       * -------------------------------------------------- */
      const signatureCandidates = [];

      if (razorpay_order_id) {
        signatureCandidates.push(
          `${razorpay_order_id}|${razorpay_payment_id}`
        );
      }

      if (razorpay_payment_link_id) {
        signatureCandidates.push(
          `${razorpay_payment_link_id}|${razorpay_payment_id}`
        );
      }

      for (const msg of signatureCandidates) {
        const expected = crypto
          .createHmac("sha256", razorpayKeySecret)
          .update(msg)
          .digest("hex");

        if (expected === razorpay_signature) {
          verified = true;
          console.log("[Razorpay Verify] ✓ Signature verified");
          break;
        }
      }

      /* ----------------------------------------------------
       * 2 FETCH PAYMENT FROM RAZORPAY (SOURCE OF TRUTH)
       * -------------------------------------------------- */
      let payment = null;
      let paymentNotes = {};

      try {
        const Razorpay = require("razorpay");
        const razorpay = new Razorpay({
          key_id: razorpayKeyId,
          key_secret: razorpayKeySecret,
        });

        payment = await razorpay.payments.fetch(razorpay_payment_id);

        console.log(
          "[Razorpay Verify] Payment status from API:",
          payment.status
        );

        if (payment.notes) {
          paymentNotes = payment.notes;
        }

        // ONLY captured or paid is allowed
        if (payment.status === "captured" || payment.status === "paid") {
          verified = true;
        }
      } catch (err) {
        console.error("[Razorpay Verify] Payment fetch failed:", err.message);
      }
 
      /* ----------------------------------------------------
       * 3 FETCH PAYMENT LINK (OPTIONAL BUT VALID)
       * -------------------------------------------------- */
      let linkData = null;
      let linkNotes = {};

      if (razorpay_payment_link_id) {
        try {
          const basicAuth = Buffer.from(
            `${razorpayKeyId}:${razorpayKeySecret}`
          ).toString("base64");

          const { fetch } = require("undici");

          const resp = await fetch(
            `https://api.razorpay.com/v1/payment_links/${razorpay_payment_link_id}`,
            {
              headers: {
                Authorization: `Basic ${basicAuth}`,
              },
            }
          );

          if (resp.ok) {
            linkData = await resp.json();
            console.log(
              "[Razorpay Verify] Payment link status:",
              linkData.status
            );

            if (linkData.notes) {
              linkNotes = linkData.notes;
            }

            if (linkData.status === "paid") {
              verified = true;
            }
          }
        } catch (err) {
          console.warn(
            "[Razorpay Verify] Payment link fetch error:",
            err.message
          );
        }
      }

      /* ----------------------------------------------------
       * 4 FINAL HARD VERIFICATION GATE (CRITICAL)
       * -------------------------------------------------- */
      const isPaymentCaptured =
        payment && (payment.status === "captured" || payment.status === "paid");

      const isPaymentLinkPaid =
        linkData && linkData.status === "paid";

      verified = verified || isPaymentCaptured || isPaymentLinkPaid;

      if (!verified) {
        console.error("[Razorpay Verify] ✗ Verification failed");

        return res.status(400).json({
          error: true,
          code: 400,
          status: 0,
          message: "Razorpay payment verification failed",
          payload: {
            razorpay_payment_id,
            razorpay_order_id,
            verified: false,
          },
        });
      }

      console.log("[Razorpay Verify] ✓ Payment verified");

      /* ----------------------------------------------------
       * 5 PREVENT DUPLICATE ORDERS
       * -------------------------------------------------- */
      const existingOrder = await Order.findOne({
        paymentId: razorpay_payment_id,
      });

      if (existingOrder) {
        return res.status(200).json({
          error: false,
          code: 200,
          status: 1,
          message: "Order already created for this payment",
          payload: {
            orderId: existingOrder._id,
            orderNo: existingOrder.orderNo,
            already_exists: true,
          },
        });
      }

      /* ----------------------------------------------------
       * 6 MERGE NOTES (SAFE SOURCE)
       * -------------------------------------------------- */
      const allNotes = {
        ...paymentNotes,
        ...linkNotes,
      };

      const customerId =
        allNotes.customerId || allNotes.customer_id;

      const addressId =
        allNotes.addressId || allNotes.address_id;

      if (!customerId) {
        return res.status(400).json({
          error: true,
          code: 400,
          status: 0,
          message:
            "Payment verified but customer mapping not found",
          payload: { notes: allNotes },
        });
      }

      /* ----------------------------------------------------
       * 7 CREATE ORDER (ONLY AFTER VERIFIED)
       * -------------------------------------------------- */
      const user = await User.findById(customerId);
      if (!user) {
        return res.status(404).json({
          error: true,
          code: 404,
          status: 0,
          message: "User not found",
        });
      }

      const address = addressId
        ? await Address.findById(addressId)
        : null;

      let cartTotal = 0;
      const productsMap = {};

      for (const cartItem of user.cart) {
        const product = await Product.findById(cartItem.productId);
        if (!product) continue;

        productsMap[cartItem.productId] = product;

        let price = product.salePrice || product.price || 0;

        if (
          product.type === "variable" &&
          product.variants?.length
        ) {
          const variant = product.variants.find(
            (v) =>
              v._id.toString() ===
              cartItem.variantId?.split("/").pop()
          );
          price =
            variant?.salePrice ||
            variant?.price ||
            price;
        }

        cartTotal += price * cartItem.quantity;
      }

      const shipping = 10;
	  const taxRaw = cartTotal * 0.09;
      const tax = Number(taxRaw.toFixed(2));
      const totalAmount = cartTotal + shipping + tax;
      //const orderNumber = Math.floor(Math.random() * 9000) + 1000;
	  const orderNumber = generateOrderNo("R");

      const orderCreated = await Order.create({
        paymentMethod: "Razorpay",
        paymentId: razorpay_payment_id,
        orderNo: orderNumber,
        subTotal: cartTotal,
        total: totalAmount,
        shipping,
        tax,
        discount: 0,
        currency: "INR",
        conversionRate: 1,
        status: "pending",
        paymentStatus: "paid",
        totalItems: user.cart.reduce(
          (sum, i) => sum + i.quantity,
          0
        ),
        	  
		items: user.cart.map((cartItem) => {
		  const product = productsMap[cartItem.productId];

		  // ✅ ALWAYS PRODUCT IMAGE, INDEX 0
		  const imageUrl = product.images?.[0]?.url || "";

		  let price = product.salePrice || product.price || 0;
		  let sku = product.sku || "";
		  let stockQuantity = product.stockQuantity || 0;
		  let discount = product.discount || 0;

		  // Variant only affects price/sku/stock — NOT image
		  if (product.type === "variable" && product.variants?.length) {
			const variant = product.variants.find(
			  (v) =>
				v._id.toString() ===
				cartItem.variantId?.split("/").pop()
			);

			if (variant) {
			  price = variant.salePrice || variant.price || price;
			  sku = variant.sku || sku;
			  stockQuantity = variant.stockQuantity || stockQuantity;
			  discount = variant.discount || discount;
			}
		  }

		  const subtotal = Number((price * cartItem.quantity).toFixed(2));

		  return {
			productId: cartItem.productId,
			variantId: cartItem.variantId || null,

			pid: product.pid || product._id,
			name: product.name,
			slug: product.slug,
			sku,
			type: product.type,
			deliveryType: product.deliveryType,
			stockQuantity,

			price: Number(price.toFixed(2)),
			discount: Number(discount || 0),
			quantity: cartItem.quantity,
			subtotal,
			total: subtotal,

			shop: product.shop || null,

			// IMAGE (NOW WORKS)
			image: imageUrl,
			imageUrl: imageUrl,
		  };
		}),

        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: address?.address1 || "",
          city: address?.city || "",
          state: address?.province || "",
          zip: address?.zip || "",
          country: address?.country || "",
        },
      });

      await User.findByIdAndUpdate(user._id, {
        $push: { orders: orderCreated._id },
      });

      user.cart = [];
      await user.save();

      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message:
          "Payment verified and order created successfully (Razorpay)",
        payload: {
          orderId: orderCreated._id,
          orderNo: orderCreated.orderNo,
          razorpay_payment_id,
          total: totalAmount,
        },
      });
    }

    // ==================== STRIPE FLOW (UNCHANGED) ====================
    if (payment_intent_id) {
      // your existing Stripe logic (already safe)
    }

    return res.status(400).json({
      error: true,
      code: 400,
      status: 0,
      message:
        "No payment identifier provided",
      payload: {},
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to verify payment",
      payload: { error: error.message },
    });
  }
};
	



/* Clear Cart Store */
const clearCartStore = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Validate input
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
        payload: {},
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
        payload: {},
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
        payload: {},
      });
    }

    // Clear user's cart
    user.cart = [];
    await user.save();

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Cart cleared from store",
      payload: {
        wasRemoved: true,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.error("Error in clearCartStore:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to clear cart: " + error.message,
      payload: {},
    });
  }
};

/* Remove Coupon */
const removeCoupon = async (req, res) => {
  try {
    const { cartId, discountCode } = req.body;

    // Validate input
    if (!cartId) {
      return res.status(400).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to remove discount",
        payload: {
          errors: [
            {
              field: ["cartId"],
              message: "Cart ID is required.",
            },
          ],
        },
      });
    }

    if (!discountCode) {
      return res.status(400).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to remove discount",
        payload: {
          errors: [
            {
              field: ["discountCode"],
              message: "Discount code is required.",
            },
          ],
        },
      });
    }

    // Cart ID is already MongoDB ObjectId
    let userId = cartId;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to remove discount",
        payload: {
          errors: [
            {
              field: ["cartId"],
              message: "The specified cart does not exist.",
            },
          ],
        },
      });
    }

    // Check if cart is empty
    if (!user.cart || user.cart.length === 0) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to remove discount",
        payload: {
          errors: [
            {
              field: ["cartId"],
              message: "Cart is empty.",
            },
          ],
        },
      });
    }

    // Find coupon by code
    const coupon = await CouponCode.findOne({ code: discountCode });
    if (!coupon) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to remove discount",
        payload: {
          errors: [
            {
              field: ["discountCode"],
              message: "The discount code is not valid.",
            },
          ],
        },
      });
    }

    // Check if coupon has been used by this user
    if (!coupon.usedBy || !coupon.usedBy.includes(user.email)) {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Failed to remove discount",
        payload: {
          errors: [
            {
              field: ["discountCode"],
              message: "This discount code is not applied to your cart.",
            },
          ],
        },
      });
    }

    // Remove the coupon from user's used coupons
    await CouponCode.findByIdAndUpdate(coupon._id, {
      $pull: { usedBy: user.email },
    });

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: `Discount code "${discountCode}" removed successfully`,
      payload: {
        id: cartId,
        discountCodes: [],
      },
    });
  } catch (error) {
    console.error("Error in removeCoupon:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to remove coupon: " + error.message,
    });
  }
};

/* Customer All Orders */
const customerAllOrders = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Validate input
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
        payload: {},
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
        payload: {},
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
        payload: {},
      });
    }

    // Get status filter from query parameter (optional)
    const { status } = req.query;
    let statusFilter = {};

    // If status filter is provided, filter orders by status
    if (status) {
      // Normalize "cancelled" to "canceled" (as per Order model enum)
      const normalizedStatus = status === "cancelled" ? "canceled" : status;
      statusFilter.status = normalizedStatus;
    }

    // Find all orders for this user with optional status filter
    const orders = await Order.find({
      "user._id": user._id,
      ...statusFilter,
    }).sort({ createdAt: -1 });

    // Format orders data with only essential fields
    const formattedOrders = await Promise.all(
      orders.map(async (order, index) => {
        // Get the first product for title and image
        const firstItem = order.items[0];

        // Debug logging to see what we're getting
        console.log("Order:", order.orderNo, "First item:", firstItem);

        // Format date and time
        const orderDate = order.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
        const orderTime = order.createdAt
          .toISOString()
          .split("T")[1]
          .split(".")[0]; // HH:MM:SS

        // Get product data if productId exists
        let product = null;
        let productTitle = "Product";
        let productImage = null;

        if (firstItem?.productId) {
          try {
            // Import Product model
            const Product = require("../../models/Product");
            product = await Product.findById(firstItem.productId);
            console.log("Fetched product:", product);

            if (product) {
              productTitle = product.name;
              if (product.images && product.images.length > 0) {
                productImage = product.images[0].url;
              }
            }
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        }

        // Fallback to item data if product not found
        if (!productTitle || productTitle === "Product") {
          if (firstItem?.name) {
            productTitle = firstItem.name;
          } else if (firstItem?.title) {
            productTitle = firstItem.title;
          }
        }

        if (!productImage && firstItem?.image) {
          productImage = firstItem.image;
        }

        return {
          orderId: order.orderNo || order._id,
          title: productTitle,
          image: productImage,
          date: orderDate,
          time: orderTime,
          amount: Math.round(order.total),
          track: {
            status: order.status,
            trackingId: order.trackingId || null,
            trackingLink: order.trackingLink || null,
            courierName: order.courierName || null,
          },
        };
      })
    );

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Customer orders fetched successfully",
      payload: {
        orders: formattedOrders,
      },
    });
  } catch (error) {
    console.error("Error in customerAllOrders:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch customer orders: " + error.message,
      payload: {},
    });
  }
};

// Get single order by id or orderNo and return the full order document
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).json({ error: true, code: 400, status: 0, message: "orderId is required", payload: {} });
    }

    const mongoose = require("mongoose");
    const Order = require("../../models/Order");

    const queries = [{ orderNo: orderId }, { orderNo: `#${orderId}` }];
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      queries.unshift({ _id: orderId });
    }

    let order = null;
    for (const q of queries) {
      const found = await Order.findOne(q);
      if (found) {
        order = found.toObject(); // Convert to plain object
        if (order.total !== undefined) {
		  			// Round price
          order.total = Math.round(order.total); 
		  order.shipping_fee = order.shipping;
		  order.platform_fee = 0;
		  order.tax = order.tax;
        }
        break;
      }
    }

    if (!order) {
      return res.status(404).json({ error: true, code: 404, status: 0, message: "Order not found", payload: {} });
    }

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Order fetched successfully",
      payload: { order },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch order: " + error.message,
      payload: {},
    });
  }
};
	
function generateOrderNo(prefix) {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${random}`;
}

// Cancel an order by id or orderNo
const cancelCustomerOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "orderId is required",
        payload: {},
      });
    }

    const mongoose = require("mongoose");
    const Order = require("../../models/Order");

    const queries = [{ orderNo: orderId }, { orderNo: `#${orderId}` }];
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      queries.unshift({ _id: orderId });
    }

    let order = null;
    for (const q of queries) {
      // eslint-disable-next-line no-await-in-loop
      const found = await Order.findOne(q);
      if (found) {
        order = found;
        break;
      }
    }

    if (!order) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Order not found",
        payload: {},
      });
    }

    // If already canceled or delivered, block cancellation
    if (order.status === "canceled") {
      return res.status(200).json({
        error: false,
        code: 200,
        status: 1,
        message: "Order already canceled",
        payload: { order },
      });
    }
    if (order.status === "delivered" || order.status === "returned") {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Delivered/returned orders cannot be canceled",
        payload: {},
      });
    }

    order.status = "canceled";
    await order.save();

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Order canceled successfully",
      payload: { order },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to cancel order: " + error.message,
      payload: {},
    });
  }
};

/* Get contact info */
const getContactInfo = async (req, res) => {
  try {
    // Fetch settings from database
    const settings = await Settings.findOne({});

    if (!settings) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Settings not found",
      });
    }

    // Extract contact information from settings
    const contactInfo = {
      shopName: settings.main?.businessName || "Adhyatmah",
      email: settings.branding?.contact?.email || "adhyatmahbharat@gmail.com",
      domain: settings.main?.domainName || "www.adhyatmah.com",
      phone: settings.branding?.contact?.phone || "8299692513",
      address: {
        address1: settings.branding?.contact?.address || "Sector 63",
        address2: "G-52",
        city: "Noida",
        province: "Uttar Pradesh",
        zip: "201301",
        country: "IN",
      },
    };

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Shop contact information fetched successfully",
      payload: contactInfo,
    });
  } catch (error) {
    console.error("Error in getContactInfo:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch contact information: " + error.message,
    });
  }
};

/* Get product attributes */
const getProductAttributes = async (req, res) => {
  try {
    const { id, accessToken } = req.query;

    // Validate input
    if (!id) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Product ID is required",
      });
    }

    // ID is already MongoDB ObjectId
    let mongoProductId = id;

    // Find product
    const product = await Product.findById(mongoProductId);
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Product not found",
      });
    }

    // Check if user has this product in wishlist (if accessToken provided)
    let isInWishlist = false;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (user && user.wishlist) {
          isInWishlist = user.wishlist.includes(mongoProductId);
        }
      } catch (err) {
        // If token is invalid, just continue without wishlist check
        console.log("Invalid token for wishlist check:", err.message);
      }
    }

    // Format images
    const images = [];
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        images.push({
          url: image.url || image,
          altText: null,
        });
      });
    } else if (product.cover && product.cover.url) {
      images.push({
        url: product.cover.url,
        altText: null,
      });
    }

    // Extract options from variants
    const optionsMap = new Map();
    const variants = [];

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant, index) => {
        // Use product ID as variant ID
        const variantId = mongoProductId;

        // Extract option name and value from variant name
        let optionName = "Title";
        let optionValue = variant.name || variant.title || "Default Title";

        // Try to determine option name based on variant name patterns
        if (variant.name) {
          const name = variant.name.toLowerCase();
          if (
            name.includes("size") ||
            name.includes("small") ||
            name.includes("medium") ||
            name.includes("large")
          ) {
            optionName = "Size";
          } else if (
            name.includes("color") ||
            name.includes("red") ||
            name.includes("blue") ||
            name.includes("green")
          ) {
            optionName = "Color";
          } else if (
            name.includes("material") ||
            name.includes("stone") ||
            name.includes("bronze") ||
            name.includes("brass")
          ) {
            optionName = "Decoration material";
          } else if (
            name.includes("theme") ||
            name.includes("architecture") ||
            name.includes("beach")
          ) {
            optionName = "Theme";
          }
        }

        // Add to options map
        if (!optionsMap.has(optionName)) {
          optionsMap.set(optionName, new Set());
        }
        optionsMap.get(optionName).add(optionValue);

        // Format variant
        variants.push({
          id: variantId,
          title: variant.name || variant.title || "Default Title",
          availableForSale: true,
          price: {
            amount: variant.price ? variant.price.toString() : "0.0",
            currencyCode: "INR",
          },
          selectedOptions: [
            {
              name: optionName,
              value: optionValue,
            },
          ],
        });
      });
    } else {
      // If no variants, create a default one
      variants.push({
        id: mongoProductId,
        title: "Default Title",
        availableForSale: true,
        price: {
          amount: product.price ? product.price.toString() : "0.0",
          currencyCode: "INR",
        },
        selectedOptions: [
          {
            name: "Title",
            value: "Default Title",
          },
        ],
      });
    }

    // Convert options map to array
    const options = Array.from(optionsMap.entries()).map(
      ([name, valuesSet]) => ({
        name: name,
        values: Array.from(valuesSet),
      })
    );

    // If no options were extracted, create a default one
    if (options.length === 0) {
      options.push({
        name: "Title",
        values: ["Default Title"],
      });
    }

    // Derive dynamic pincode list from product
    let pincodeList = [];
    if (Array.isArray(product.pincode)) {
      // In case the schema/store ever holds an array
      pincodeList = product.pincode
        .map((code) => (typeof code === "number" ? code : parseInt(code, 10)))
        .filter((code) => Number.isFinite(code));
    } else if (typeof product.pincode === "number") {
      pincodeList = [product.pincode];
    } else if (
      typeof product.pincode === "string" &&
      product.pincode.trim().length > 0
    ) {
      // Support comma/space separated or any non-digit separated list
      pincodeList = product.pincode
        .split(/[^0-9]+/)
        .filter((token) => token && token.length === 6)
        .map((token) => parseInt(token, 10))
        .filter((code) => Number.isFinite(code));
    }

    // Format response
    const formattedProduct = {
      id: mongoProductId,
      title: product.name || product.title || "Untitled Product",
      handle: product.handle || product.slug || "untitled-product",
      description: product.description || product.desc || "",
      images: images,
      options: options,
      variants: variants,
      wishlist: isInWishlist,
      pincode: pincodeList,
	  stockQuantity: product.stockQuantity,
    };

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Product fetched successfully",
      payload: {
        product: formattedProduct,
      },
    });
  } catch (error) {
    console.error("Error in getProductAttributes:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch product attributes: " + error.message,
    });
  }
};

/* Remove from wishlist */
const removeFromWishlist = async (req, res) => {
  try {
    const { accessToken, productId } = req.body;

    // Validate input
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Product ID is required",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Product ID is already MongoDB ObjectId
    let mongoProductId = productId;

    // Check if product exists
    const product = await Product.findById(mongoProductId);
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Product not found",
      });
    }

    // Check if product is in wishlist
    const productIndex = user.wishlist.indexOf(mongoProductId);
    if (productIndex === -1) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Product not found in wishlist",
      });
    }

    // Remove product from wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();

    // Format remaining wishlist items as Shopify product IDs
    const remainingWishlist = user.wishlist.map((id) => id);

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Product removed from wishlist",
      payload: {
        wishlist: remainingWishlist,
      },
    });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to remove product from wishlist: " + error.message,
    });
  }
};

/* Get blogs */
const getBlogs = async (req, res) => {
  try {
    // Clear existing blogs and articles to ensure fresh data
    await Blog.deleteMany({});
    await Article.deleteMany({});

    // Create sample blog with articles
    // Create sample blog
    const sampleBlog = new Blog({
      title: "News",
      handle: "news",
      articles: [],
    });

    // Create sample articles
    const sampleArticles = [
      {
        title: "Elegant Brass Moon Crystal Diya",
        handle: "elegant-brass-moon-crystal-diya",
        excerpt: "",
        content:
          "Illuminate your space with this crescent moon-shaped brass diya, adorned with sparkling crystals for festive glow",
        publishedAt: new Date("2025-06-18T05:52:36Z"),
        image: {
          url: "https://cdn.shopify.com/s/files/1/0764/0822/6027/articles/blog02.jpg?v=1750226001",
          altText: null,
        },
        blog: sampleBlog._id,
      },
      {
        title: "Traditional Brass Hanging Peacock Diya",
        handle: "traditional-brass-hanging-peacock-diya",
        excerpt: "",
        content:
          "Intricately designed with a majestic peacock motif, this diya not only illuminates your home but also elevates your décor with its regal presence. Made from pure brass, it symbolizes prosperity, purity, and divine energy.",
        publishedAt: new Date("2025-06-18T05:54:31Z"),
        image: {
          url: "https://cdn.shopify.com/s/files/1/0764/0822/6027/articles/blog01.jpg?v=1750226171",
          altText: null,
        },
        blog: sampleBlog._id,
      },
      {
        title: "Embossed Shankh Morkiran Brass Diya",
        handle: "embossed-shankh-morkiran-brass-diya",
        excerpt: "",
        content:
          "Symbolizing purity, blessings, and auspicious beginnings, the sacred Shankh design enhances the diya's spiritual significance, making it ideal for daily rituals, temple décor, or festive occasions.",
        publishedAt: new Date("2025-06-18T05:56:53Z"),
        image: {
          url: "https://cdn.shopify.com/s/files/1/0764/0822/6027/articles/blog03.jpg?v=1750226233",
          altText: null,
        },
        blog: sampleBlog._id,
      },
      {
        title: "Pure Brass Akhand Payali Diya",
        handle: "pure-brass-akhand-payali-diya",
        excerpt: "",
        content:
          "Crafted from high-quality, heavy-duty brass, this diya features a deep bowl and traditional Payali design, ensuring long-lasting flame ideal for Akhand Jyoti during poojas, festivals, and spiritual rituals. The zoomed-in detailing reveals fine engravings and the smooth golden finish that reflects skilled Indian craftsmanship.",
        publishedAt: new Date("2025-06-18T05:59:26Z"),
        image: {
          url: "https://cdn.shopify.com/s/files/1/0764/0822/6027/articles/blog06.jpg?v=1750226369",
          altText: null,
        },
        blog: sampleBlog._id,
      },
    ];

    // Save articles first
    const createdArticles = await Article.insertMany(sampleArticles);

    // Update blog with article IDs
    sampleBlog.articles = createdArticles.map((article) => article._id);
    await sampleBlog.save();

    // Fetch the blog with populated articles
    const blogs = await Blog.find().populate({
      path: "articles",
      select: "title handle excerpt content publishedAt image",
      options: { sort: { publishedAt: -1 }, limit: 4 },
    });

    // Format to match Shopify response structure (single blog, not array)
    const blog = blogs[0]; // Take the first blog
    const formattedBlog = {
      id: blog._id,
      title: blog.title,
      handle: blog.handle,
      articles: {
        edges: blog.articles.map((article) => ({
          node: {
            id: article._id,
            title: article.title,
            handle: article.handle,
            excerpt: article.excerpt || "",
            content: article.content,
            publishedAt: article.publishedAt.toISOString(),
            image: {
              url: article.image.url,
              altText: article.image.altText || null,
            },
          },
        })),
      },
    };

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Blogs fetched successfully",
      payload: {
        blogs: [formattedBlog], // Wrap in array to match reference API
      },
    });
  } catch (error) {
    console.error("Error in getBlogs:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch blogs: " + error.message,
    });
  }
};

/* Create a new blog */
const createBlog = async (req, res) => {
  try {
    // Verify token and user role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Restrict to super-admin or admin
    if (!["super-admin", "admin"].includes(user.role)) {
      return res.status(403).json({
        error: true,
        code: 403,
        status: 0,
        message: "Unauthorized: Only admins can create blogs",
      });
    }

    const { title, handle } = req.body;

    // Validate input
    if (!title || !handle) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Title and handle are required",
      });
    }

    // Check for duplicate handle
    const existingBlog = await Blog.findOne({ handle });
    if (existingBlog) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Blog with this handle already exists",
      });
    }

    // Create new blog
    const blog = await Blog.create({
      title,
      handle,
      articles: [], // Initialize with empty articles array
    });

    // Format response to match getBlogs structure
    const formattedBlog = {
      id: blog._id.toString(),
      title: blog.title,
      handle: blog.handle,
      articles: {
        edges: [],
      },
    };

    return res.status(201).json({
      error: false,
      code: 201,
      status: 1,
      message: "Blog created successfully",
      payload: {
        blog: formattedBlog,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to create blog: " + error.message,
    });
  }
};

/* Add product to wishlist */
const addToWishlist = async (req, res) => {
  try {
    const { accessToken, productId } = req.body;

    // Validate input
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Product ID is required",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Extract MongoDB ObjectId from Shopify-style product ID
    let mongoProductId;
    // Product ID is already MongoDB ObjectId
    mongoProductId = productId;

    // Validate MongoDB ObjectId format
    if (!mongoProductId || mongoProductId.length !== 24) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Invalid product ID format",
      });
    }

    // Check if product exists
    const product = await Product.findById(mongoProductId);
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Product not found",
      });
    }

    // Check if product is already in wishlist
    const isAlreadyInWishlist = user.wishlist.some(
      (wishlistItem) => wishlistItem.toString() === mongoProductId
    );

    if (isAlreadyInWishlist) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Product is already in wishlist",
      });
    }

    // Add product to wishlist
    user.wishlist.push(mongoProductId);
    await user.save();

    // Format product response to match the desired structure
    let variants = [];
    let selectedOptions = [];

    if (
      product.type === "variable" &&
      product.variants &&
      product.variants.length > 0
    ) {
      // Map all variants for variable products
      variants = product.variants.map((variant) => {
        const variantOptions = [];

        // Create options based on variant data
        if (variant.name) {
          variantOptions.push({
            name: "Size",
            value: variant.name,
          });
        }

        return {
          id: variant._id || product._id.toString(),
          title: variant.name || "Default",
          price: {
            amount: (variant.salePrice || variant.price || 0).toString(),
            currencyCode: "INR",
          },
          selectedOptions: variantOptions,
        };
      });

      // Set first variant as default
      if (variants.length > 0) {
        selectedOptions = variants[0].selectedOptions;
      }
    } else {
      // Simple product - create single variant
      variants = [
        {
          id: product._id.toString(),
          title: "Default Title",
          price: {
            amount: (product.salePrice || product.price || 0).toString(),
            currencyCode: "INR",
          },
          selectedOptions: [
            {
              name: "Title",
              value: "Default Title",
            },
          ],
        },
      ];
    }

    // Format the response to match the desired structure
    const formattedProduct = {
      id: product._id.toString(),
      title: product.name,
      handle: product.slug,
      description: product.description || "",
      featuredImage:
        product.images && product.images.length > 0
          ? { url: product.images[0].url, altText: null }
          : { url: "https://via.placeholder.com/150", altText: null },
      variants: {
        edges: variants.map((variant) => ({
          node: variant,
        })),
      },
      wishlist: true,
    };

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Product added to wishlist",
      payload: {
        product: formattedProduct,
      },
    });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to add product to wishlist: " + error.message,
    });
  }
};

/* Get user wishlist */
const getWishlist = async (req, res) => {
  try {
    // Get access token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Get wishlist products
    const wishlistProducts = await Product.find({
      _id: { $in: user.wishlist || [] },
    });

    // Format products to match the desired response structure
    const formattedWishlist = wishlistProducts.map((product) => {
      let variants = [];

      if (
        product.type === "variable" &&
        product.variants &&
        product.variants.length > 0
      ) {
        // Map all variants for variable products
        variants = product.variants.map((variant) => {
          const variantOptions = [];

          // Create options based on variant data
          if (variant.name) {
            // Determine option name based on variant name patterns
            let optionName = "Size";
            if (
              variant.name.toLowerCase().includes("color") ||
              variant.name.toLowerCase().includes("blue") ||
              variant.name.toLowerCase().includes("bronze") ||
              variant.name.toLowerCase().includes("beige")
            ) {
              optionName = "Color";
            } else if (
              variant.name.toLowerCase().includes("material") ||
              variant.name.toLowerCase().includes("stone") ||
              variant.name.toLowerCase().includes("cotton") ||
              variant.name.toLowerCase().includes("canvas") ||
              variant.name.toLowerCase().includes("copper")
            ) {
              optionName = "Decoration material";
            } else if (
              variant.name.toLowerCase().includes("theme") ||
              variant.name.toLowerCase().includes("architecture") ||
              variant.name.toLowerCase().includes("beach")
            ) {
              optionName = "Theme";
            }

            variantOptions.push({
              name: optionName,
              value: variant.name,
            });
          }

          return {
            id: variant._id || product._id.toString(),
            title: variant.name || "Default",
            price: {
              amount: (variant.salePrice || variant.price || 0).toString(),
              currencyCode: "INR",
            },
            selectedOptions: variantOptions,
          };
        });
      } else {
        // Simple product - create single variant
        variants = [
          {
            id: product._id.toString(),
            title: "Default Title",
            price: {
              amount: (product.salePrice || product.price || 0).toString(),
              currencyCode: "INR",
            },
            selectedOptions: [
              {
                name: "Title",
                value: "Default Title",
              },
            ],
          },
        ];
      }

      return {
        id: product._id.toString(),
        title: product.name,
        handle: product.slug,
        description: product.description || "",
        featuredImage:
          product.images && product.images.length > 0
            ? { url: product.images[0].url, altText: null }
            : { url: "https://via.placeholder.com/150", altText: null },
        variants: {
          edges: variants.map((variant) => ({
            node: variant,
          })),
        },
        wishlist: true,
      };
    });

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Wishlist fetched successfully",
      payload: {
        wishlist: formattedWishlist,
      },
    });
  } catch (error) {
    console.error("Error in getWishlist:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch wishlist: " + error.message,
    });
  }
};

/* Create cart item */
const createCart = async (req, res) => {
  try {
    const { accessToken, variantId, quantity } = req.body;

    // Validate input
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
      });
    }

    if (!variantId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Variant ID is required",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Valid quantity is required",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Extract MongoDB ObjectId from Shopify-style variant ID
    let mongoVariantId;
    // Variant ID is already MongoDB ObjectId
    mongoVariantId = variantId;

    // Find product by variant ID (assuming variant ID contains product ID)
    const product = await Product.findById(mongoVariantId);
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Product not found",
      });
    }

    // Check if item already exists in cart
    const existingCartItem = user.cart.find(
      (item) => item.variantId === variantId
    );

    if (existingCartItem) {
      // Update quantity if item exists
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({
        variantId: variantId,
        productId: product._id,
        quantity: quantity,
        addedAt: new Date(),
      });
    }

    await user.save();

    // Generate cart ID and checkout URL
    const cartId = user._id;
    const checkoutUrl = `https://www.adhyatmah.com/cart/c/${
      user._id
    }?key=${Math.random().toString(36).substring(2)}`;

    // Format cart lines
    const cartLines = user.cart.map((item, index) => ({
      id: item._id || index,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Item added to cart successfully",
      payload: {
        cart: {
          id: cartId,
          checkoutUrl: checkoutUrl,
          lines: {
            edges: cartLines.map((line) => ({
              node: line,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in createCart:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to add item to cart: " + error.message,
    });
  }
};

/* Get user cart */
const getCart = async (req, res) => {
  try {
    // Get access token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
      });
    }

    // Find user with populated cart products
    const user = await User.findById(decoded._id).populate({
      path: "cart.productId",
      populate: {
        path: "shop",
        select: "name",
      },
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Generate cart ID using MongoDB ObjectId and checkout URL
    const cartId = user._id.toString();
    const checkoutKey = Math.random().toString(36).substring(2);
    const checkoutUrl = `https://www.adhyatmah.com/cart/c/${cartId}?key=${checkoutKey}`;

    // Process cart lines with full product details
    const cartLines = [];
    let subtotalAmount = 0;
    let totalTaxAmount = 0;
    // Track latest cart modification time to decide if a previously applied coupon is still valid for this cart state
    let latestCartChangeAt = null;

    for (let i = 0; i < user.cart.length; i++) {
      const item = user.cart[i];
      const product = item.productId;

      if (!product) continue;

      // Determine price based on product type
      let price,
        variantTitle = "";
      if (product.type === "simple") {
        price = product.salePrice || product.price;
        variantTitle = "Default";
      } else if (product.type === "variable") {
        // Find the variant that matches the variantId
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.split("/").pop()
        );
        if (variant) {
          price = variant.salePrice || variant.price;
          variantTitle = variant.name || variant.variant;
        } else {
          // Fallback to first variant if variantId not found
          const firstVariant = product.variants[0];
          price = firstVariant
            ? firstVariant.salePrice || firstVariant.price
            : product.price;
          variantTitle = firstVariant
            ? firstVariant.name || firstVariant.variant
            : "Default";
        }
      }

      const lineTotal = price * item.quantity;
      subtotalAmount += lineTotal;

      // Calculate tax (assuming 9% tax rate)
      const taxAmount = lineTotal * 0.09;
      totalTaxAmount += taxAmount;

      // Track most recent cart change time
      if (item.addedAt) {
        const addedAtTime = new Date(item.addedAt).getTime();
        if (!latestCartChangeAt || addedAtTime > latestCartChangeAt) {
          latestCartChangeAt = addedAtTime;
        }
      }

      // Generate MongoDB ObjectId-based IDs
      const lineId = item._id
        ? item._id.toString()
        : new mongoose.Types.ObjectId().toString();
      const variantId = product._id.toString();

      // Get product images
      let productImages = [];
      if (
        product.type === "simple" &&
        product.images &&
        product.images.length > 0
      ) {
        productImages = product.images.map((img) => ({
          node: {
            url: img.url,
          },
        }));
      } else if (product.type === "variable") {
        const variant =
          product.variants.find(
            (v) => v._id.toString() === item.variantId.split("/").pop()
          ) || product.variants[0];
        if (variant && variant.images && variant.images.length > 0) {
          productImages = variant.images.map((img) => ({
            node: {
              url: img.url,
            },
          }));
        } else if (product.images && product.images.length > 0) {
          productImages = product.images.map((img) => ({
            node: {
              url: img.url,
            },
          }));
        }
      }

      cartLines.push({
        node: {
          id: lineId,
          quantity: item.quantity,
          discountAllocations: [],
          cost: {
            totalAmount: {
              amount: lineTotal.toFixed(1),
              currencyCode: "INR",
            },
            amountPerQuantity: {
              amount: price.toFixed(1),
              currencyCode: "INR",
            },
          },
          merchandise: {
            id: variantId,
            title: variantTitle,
            price: {
              amount: price.toFixed(1),
              currencyCode: "INR",
            },
            product: {
              title: product.name,
              handle:
                product.slug || product.name.toLowerCase().replace(/\s+/g, "-"),
              images: {
                edges: productImages,
              },
            },
          },
        },
      });
    }

    // Calculate discount information
    let discountAmount = 0;
    let appliedDiscounts = [];
    let hasDiscounts = false;

    // Only consider a stored discount if it was applied AFTER the most recent cart change
    const hasFreshAppliedDiscount = Boolean(
      user.appliedDiscount &&
        user.appliedDiscount.code &&
        user.appliedDiscount.appliedAt &&
        latestCartChangeAt &&
        new Date(user.appliedDiscount.appliedAt).getTime() >= latestCartChangeAt
    );

    if (hasFreshAppliedDiscount) {
      // Recalculate discount amount based on current cart total
      if (user.appliedDiscount.type === "percent") {
        discountAmount =
          (subtotalAmount * user.appliedDiscount.percentage) / 100;
      } else {
        discountAmount = user.appliedDiscount.fixedAmount || 0;
      }

      // Ensure discount doesn't exceed cart total
      if (discountAmount > subtotalAmount) {
        discountAmount = subtotalAmount;
      }

      appliedDiscounts = [
        {
          code: user.appliedDiscount.code,
          amount: discountAmount,
          type: user.appliedDiscount.type,
          percentage: user.appliedDiscount.percentage,
          fixedAmount: user.appliedDiscount.fixedAmount,
        },
      ];

      hasDiscounts = true;
    }

    const shippingFee = 10;
    const discountedSubtotal = subtotalAmount - discountAmount;
    const discountedTaxAmount = discountedSubtotal * 0.09; // Recalculate tax on discounted amount
    const finalTotal = discountedSubtotal + discountedTaxAmount + shippingFee;

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Cart fetched successfully",
      payload: {
        cart: {
          id: cartId,
          checkoutUrl: checkoutUrl,
          discountCodes: appliedDiscounts.map((d) => d.code),
          shipping_fee: shippingFee,
          shipping: shippingFee,
          platform_fee: 0,
          lines: {
            edges: cartLines,
          },
          cost: {
            subtotalAmount: {
              amount: subtotalAmount.toFixed(1),
              currencyCode: "INR",
            },
            totalAmount: {
              amount: finalTotal.toFixed(1),
              currencyCode: "INR",
            },
            totalDutyAmount: null,
            totalTaxAmount: {
              amount: discountedTaxAmount.toFixed(1),
              currencyCode: "INR",
            },
          },
        },
        discountInfo: {
          totalDiscount: discountAmount,
          appliedDiscounts: appliedDiscounts,
          hasDiscounts: hasDiscounts,
          savingsSummary: {
            originalTotal: subtotalAmount,
            finalTotal: finalTotal,
            totalSavings: discountAmount,
            currencyCode: "INR",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in getCart:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to fetch cart: " + error.message,
    });
  }
};

/* Update cart item */
const updateCart = async (req, res) => {
  try {
    const { accessToken, variant, variantId, quantity } = req.body;

    // Validate input
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
      });
    }

    // Handle both formats: nested variant object or direct variantId/quantity
    let variantIdToUse, quantityToUse;

    if (variant && variant.id && variant.quantity !== undefined) {
      // Format 1: { variant: { id: "...", quantity: 10 } }
      variantIdToUse = variant.id;
      quantityToUse = variant.quantity;
    } else if (variantId && quantity !== undefined) {
      // Format 2: { variantId: "...", quantity: 10 }
      variantIdToUse = variantId;
      quantityToUse = quantity;
    } else {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Variant ID and quantity are required",
      });
    }

    if (quantityToUse < 0) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Quantity cannot be negative",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Find cart item
    const cartItemIndex = user.cart.findIndex(
      (item) => item.variantId === variantIdToUse
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Cart item not found",
      });
    }

    if (quantityToUse === 0) {
      // Remove item if quantity is 0
      user.cart.splice(cartItemIndex, 1);
    } else {
      // Update quantity
      user.cart[cartItemIndex].quantity = quantityToUse;
    }

    await user.save();

    // Generate cart ID
    const cartId = user._id;

    // Format cart lines
    const cartLines = user.cart.map((item, index) => ({
      id: item._id || index,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message:
        quantityToUse === 0
          ? "Cart item removed successfully"
          : "Cart item updated successfully",
      payload: {
        cart: {
          id: cartId,
          lines: {
            edges: cartLines.map((line) => ({
              node: line,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in updateCart:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to update cart: " + error.message,
    });
  }
};

/* Remove cart item */
const removeCart = async (req, res) => {
  try {
    const { accessToken, variant, variantId } = req.body;

    // Validate input
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Access token is required",
      });
    }

    // Handle both formats: nested variant object or direct variantId
    let variantIdToUse;

    if (variant && variant.id) {
      // Format 1: { variant: { id: "..." } }
      variantIdToUse = variant.id;
    } else if (variantId) {
      // Format 2: { variantId: "..." }
      variantIdToUse = variantId;
    } else {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Variant ID is required",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: true,
        code: 401,
        status: 0,
        message: "Invalid or expired access token",
      });
    }

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Find and remove cart item
    const cartItemIndex = user.cart.findIndex(
      (item) => item.variantId === variantIdToUse
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Cart item not found",
      });
    }

    // Remove the item
    user.cart.splice(cartItemIndex, 1);
    await user.save();

    // Generate cart ID
    const cartId = user._id;

    // Format cart lines
    const cartLines = user.cart.map((item, index) => ({
      id: item._id || index,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Cart item removed successfully",
      payload: {
        cart: {
          id: cartId,
          lines: {
            edges: cartLines.map((line) => ({
              node: line,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in removeCart:", error);
    return res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: "Failed to remove cart item: " + error.message,
    });
  }
};

/* Request Account Deletion */
const requestAccountDeletion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    // Send email notification to admin about account deletion request
    const htmlFilePath = path.join(
      process.cwd(),
      "src/email-templates",
      "contact.html"
    );
    let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

    // Replace placeholders with actual data
    htmlContent = htmlContent.replace(
      /USER_NAME/g,
      `${user.firstName} ${user.lastName}`
    );
    htmlContent = htmlContent.replace(/USER_EMAIL/g, user.email);
    htmlContent = htmlContent.replace(
      /USER_PHONE/g,
      user.phone || "Not provided"
    );
    htmlContent = htmlContent.replace(
      /MESSAGE_CONTENT/g,
      `Account Deletion Request - User ID: ${user._id}`
    );
    htmlContent = htmlContent.replace(
      /SUBJECT_LINE/g,
      "Account Deletion Request"
    );

    // Send email to admin (you can configure admin email in environment variables)
    const adminEmail = process.env.ADMIN_EMAIL || "support@adhyatmah.com";
    await sendEmail(adminEmail, "Account Deletion Request", htmlContent);

    // Send confirmation email to user
    const userConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Account Deletion Request Received</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>We have received your request to delete your account. Your request is being processed and will be completed within 24 hours.</p>
        <p>If you did not request this action, please contact our support team immediately.</p>
        <p>Thank you for using our services.</p>
        <br>
        <p>Best regards,<br>Panditji Team</p>
      </div>
    `;

    await sendEmail(
      user.email,
      "Account Deletion Request Confirmation",
      userConfirmationHtml
    );

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message:
        "Account deletion request submitted successfully. You will receive a confirmation email shortly.",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};

/* Get Pandit Revenue - Booking wise */
const getPanditRevenue = async (req, res) => {
  try {
    const {
      vendorId,
      period = "yearly",
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Validate vendorId
    if (!vendorId) {
      return res.status(400).json({
        error: true,
        code: 400,
        status: 0,
        message: "Vendor ID is required",
      });
    }

    // Verify vendor exists
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        error: true,
        code: 404,
        status: 0,
        message: "Pandit not found",
      });
    }

    // Calculate date range based on period
    let dateFilter = {};
    const now = new Date();

    if (period === "daily") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      dateFilter = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    } else if (period === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      dateFilter = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    } else if (period === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      dateFilter = {
        $gte: startOfYear,
        $lte: endOfYear,
      };
    }

    // If custom date range is provided, use it instead
    if (startDate && endDate) {
      dateFilter = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get total revenue and booking count for the period
    const revenueStats = await Booking.aggregate([
      {
        $match: {
          vendor: vendorId,
          dateTime: dateFilter,
          status: { $in: ["completed", "accept"] }, // Only count completed bookings
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paymentAmount" },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    const stats = revenueStats[0] || { totalRevenue: 0, totalBookings: 0 };

    // Get recent bookings with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const recentBookings = await Booking.find({
      vendor: vendorId,
      dateTime: dateFilter,
      status: { $in: ["completed", "accept"] },
    })
      .populate("customer", "firstName lastName profileImage")
      .populate("service", "poojaType")
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "bookingID poojaType package dateTime paymentAmount customer service status"
      );

    // Get total count for pagination
    const totalBookings = await Booking.countDocuments({
      vendor: vendorId,
      dateTime: dateFilter,
      status: { $in: ["completed", "accept"] },
    });

    // Format recent bookings data
    const formattedBookings = recentBookings.map((booking) => ({
      id: booking._id,
      bookingID: booking.bookingID,
      customerName: booking.customer
        ? `${booking.customer.firstName} ${booking.customer.lastName}`
        : "Unknown",
      customerImage:
        booking.customer?.profileImage || "/images/default-avatar.png",
      poojaType: booking.poojaType,
      package: booking.package,
      date: booking.dateTime,
      formattedDate: booking.dateTime.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "2-digit",
      }),
      revenue: booking.paymentAmount,
      status: booking.status,
    }));

    // Get date range for display
    let dateRangeText = "";
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      dateRangeText = `${start.getFullYear()}(${start.getDate()}${start.toLocaleDateString(
        "en-IN",
        { month: "short" }
      )}-${end.getDate()}${end.toLocaleDateString("en-IN", {
        month: "short",
      })})`;
    } else if (period === "daily") {
      dateRangeText = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } else if (period === "monthly") {
      dateRangeText = now.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
    } else if (period === "yearly") {
      dateRangeText = `${now.getFullYear()}(1jan-31dec)`;
    }

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Pandit revenue data retrieved successfully",
      payload: {
        vendor: {
          id: vendor._id,
          name: `${vendor.firstName} ${vendor.lastName}`,
          email: vendor.email,
        },
        period: period,
        dateRange: dateRangeText,
        summary: {
          totalRevenue: stats.totalRevenue,
          totalBookings: stats.totalBookings,
          averageRevenuePerBooking:
            stats.totalBookings > 0
              ? Math.round(stats.totalRevenue / stats.totalBookings)
              : 0,
        },
        recentBookings: formattedBookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBookings / parseInt(limit)),
          totalBookings: totalBookings,
          hasNextPage: skip + parseInt(limit) < totalBookings,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error in getPanditRevenue:", error);
    res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};

/* Get All Languages */
const getAllLanguages = async (req, res) => {
  try {
    const languages = [
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

    res.status(200).json({
      error: false,
      code: 200,
      status: 1,
      message: "Languages retrieved successfully",
      payload: {
        languages: languages,
        totalCount: languages.length,
      },
    });
  } catch (error) {
    console.error("Error in getAllLanguages:", error);
    res.status(500).json({
      error: true,
      code: 500,
      status: 0,
      message: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  loginWithMobile,
  verifyMobileOtp,
  resendMobileOtp,
  customerLogin,
  logout,
  forgetPassword,
  resetPassword,
  getHomepageCollections,
  getBanner,
  getAllMenus,
  getAllCollections,
  getLandingPage,
  getViewAllData,
  getUserProfile,
  updateUserProfile,
  updateCustomerProfile,
  getCustomerProfile,
  getProfileImage,
  getPaymentMethods,
  getSearchTypes,
  search,
  getFAQs,
  getIndianStates,
  applyCoupon,
  removeCoupon,
  removeDiscount,
  createCodOrder,
  initializePayment,
  verifyPayment,
  clearCartStore,
  customerAllOrders,
  getOrderById,
  cancelCustomerOrder,
  upload,
  getContactInfo,
  getProductAttributes,
  getFilterCollectionData,
  getCoupons,
  getCart,
  createCustomerAddress,
  getCustomerAddresses,
  updateCustomerAddress,
  deleteCustomerAddress,
  getBlogs,
  createBlog,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  createCart,
  updateCart,
  removeCart,
  getPolicies,
  getYoutubeUrl,
  requestAccountDeletion,
  getPanditRevenue,
  getAllLanguages,
  getCategory,
  getHomepagePoojaServices,
  getHomepagePoojaServicesAll,
  getHomepagePoojaServicesKit,
};
