const express = require("express");
const router = express.Router();
const adhyatmahController = require("../../controllers/user/adhyatmah-app");
const verifyToken = require("../../middlewares/jwt-middleware");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create customer with optional Aadhaar image upload (field name: "aadhar")
router.post("/createCustomer", upload.single('aadhar'), adhyatmahController.createCustomer);
router.post("/login-mobile", adhyatmahController.loginWithMobile);
router.post("/verify-mobile-otp", adhyatmahController.verifyMobileOtp);
router.post("/resend-mobile-otp", adhyatmahController.resendMobileOtp);
router.post("/login", adhyatmahController.customerLogin);
router.post("/logout", verifyToken,  adhyatmahController.logout);
router.post("/forget-password", adhyatmahController.forgetPassword);
router.post("/reset-password", adhyatmahController.resetPassword);
router.get("/getHomepageCollections", adhyatmahController.getHomepageCollections);
router.get("/getHomepagePoojaServices", adhyatmahController.getHomepagePoojaServices);
router.get("/getHomepagePoojaServicesAll", adhyatmahController.getHomepagePoojaServicesAll);
router.get("/getHomepagePoojaServicesKit", adhyatmahController.getHomepagePoojaServicesKit);
router.get("/getBanner", adhyatmahController.getBanner);
router.get("/allMenus", adhyatmahController.getAllMenus);
router.get("/allCollections", adhyatmahController.getAllCollections);
router.get("/getLandingPage", adhyatmahController.getLandingPage);
router.post("/getViewAllData", adhyatmahController.getViewAllData);
router.get("/getUserProfile", verifyToken, adhyatmahController.getUserProfile);
router.put("/updateUserProfile", verifyToken, upload.single('profileImage'), adhyatmahController.updateUserProfile);
router.post("/updateCustomerProfile", adhyatmahController.updateCustomerProfile);
router.get("/getCustomerProfile", adhyatmahController.getCustomerProfile);
router.get("/getProfileImage", adhyatmahController.getProfileImage);
router.get("/getPaymentMethods", adhyatmahController.getPaymentMethods);
router.get("/getSearchTypes", adhyatmahController.getSearchTypes);
router.get("/getFAQs", adhyatmahController.getFAQs);
router.get("/getIndianStates", adhyatmahController.getIndianStates);
router.post("/search", adhyatmahController.search);
router.post("/applyCoupon", adhyatmahController.applyCoupon);
router.post("/removeCoupon", adhyatmahController.removeCoupon);
router.post("/removeDiscount", adhyatmahController.removeDiscount);
router.post("/createCodOrder", adhyatmahController.createCodOrder);
router.post("/initializePayment", adhyatmahController.initializePayment);
router.post("/verifyPayment", adhyatmahController.verifyPayment);
router.post("/clearCartStore", adhyatmahController.clearCartStore);
router.post("/customerAllOrders", adhyatmahController.customerAllOrders);
router.get("/getOrderById", adhyatmahController.getOrderById); // ?orderId=
router.post("/cancelCustomerOrder", adhyatmahController.cancelCustomerOrder);
router.post("/upload", upload.single('file'), adhyatmahController.upload);
router.get("/getContactInfo", adhyatmahController.getContactInfo);
router.get("/getPolicies", adhyatmahController.getPolicies);
router.get("/getYoutubeUrl", adhyatmahController.getYoutubeUrl);
router.get("/getProductAttributes", adhyatmahController.getProductAttributes);
router.get("/getFilterCollectionData", adhyatmahController.getFilterCollectionData);
router.get("/getCoupons", adhyatmahController.getCoupons);
router.get("/getCart", verifyToken, adhyatmahController.getCart);
router.post("/createCustomerAddress", verifyToken, adhyatmahController.createCustomerAddress);
router.get("/getCustomerAddresses", verifyToken, adhyatmahController.getCustomerAddresses);
router.put("/updateCustomerAddress", verifyToken, adhyatmahController.updateCustomerAddress);
router.post("/deleteCustomerAddress", verifyToken, adhyatmahController.deleteCustomerAddress);
router.get("/blogs", adhyatmahController.getBlogs);
router.post("/createBlog", verifyToken, adhyatmahController.createBlog);
router.post("/addToWishlist", adhyatmahController.addToWishlist);
router.get("/getWishlist", verifyToken, adhyatmahController.getWishlist);
router.post("/removeFromWishlist", adhyatmahController.removeFromWishlist);
router.post("/createCart", adhyatmahController.createCart);
router.get("/getCart", verifyToken, adhyatmahController.getCart);
router.post("/updateCart", adhyatmahController.updateCart);
router.post("/removeCart", adhyatmahController.removeCart);
router.post("/deletionAccount", adhyatmahController.requestAccountDeletion);
router.get("/getPanditRevenue", adhyatmahController.getPanditRevenue);
router.get("/getAllLanguages", adhyatmahController.getAllLanguages);
router.get("/getCategory", adhyatmahController.getCategory);


module.exports = router;
