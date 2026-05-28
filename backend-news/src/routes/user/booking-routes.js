const express = require("express");
const router = express.Router();
const bookingController = require("../../controllers/user/booking-controller"); 
const verifyToken = require("../../middlewares/jwt-middleware");

// Existing routes
router.post("/createBooking", verifyToken, bookingController.createBooking);
router.get("/getBookings", verifyToken, bookingController.getBookings);
router.post("/updateBookingStatus", verifyToken, bookingController.updateBookingStatus);
router.post("/createService", verifyToken, bookingController.createService);
router.get("/services", verifyToken, bookingController.getAllServices);
router.get("/services/:serviceId", verifyToken, bookingController.getServiceById);
router.get("/panditProfile", bookingController.getPanditProfile);
router.get("/getAllPandit", bookingController.getPanditList);

// New routes for enhanced booking flow
router.get("/availableTimeSlots", bookingController.getAvailableTimeSlots);
router.get("/panditServices", bookingController.getPanditServices);
router.get("/getAllPanditServices", bookingController.getAllPanditServices);
router.post("/checkAvailability", verifyToken, bookingController.checkPanditAvailability);
router.get("/booking", verifyToken, bookingController.getBookingById);
router.post("/cancelBooking", verifyToken, bookingController.cancelBooking);
router.get("/bookingStats", verifyToken, bookingController.getBookingStats);
router.get("/bookingHistory", verifyToken, bookingController.getVendorBookingHistory);
router.post("/reviews", verifyToken, bookingController.createVendorReview);
router.get("/reviews", bookingController.getVendorReviews);
router.post("/uploadBanner", verifyToken, bookingController.uploadBanner);
router.get("/getBanners", bookingController.getBanner);

module.exports = router;