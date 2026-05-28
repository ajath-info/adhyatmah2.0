const express = require("express");
const router = express.Router();
const booking = require("../../controllers/vendor/booking-controller");
const verifyToken = require("../../middlewares/jwt-middleware");
const { getVendor } = require("../../middlewares/getVendor-middleware");

router.get(
  "/vendor/bookings",
  verifyToken,
  getVendor,
  booking.getBookingsByVendor
);

router.get(
  "/vendor/bookings/:id",
  verifyToken,
  getVendor,
  booking.getOneBookingByVendor
);

router.put(
  "/vendor/bookings/:id/status",
  verifyToken,
  getVendor,
  booking.updateBookingStatusByVendor
);

router.get(
  "/vendor/bookings-stats",
  verifyToken,
  getVendor,
  booking.getBookingStatsByVendor
);

module.exports = router;
