const express = require("express");
const router = express.Router();
const service = require("../../controllers/vendor/service-controller");
const verifyToken = require("../../middlewares/jwt-middleware");
const { getVendor } = require("../../middlewares/getVendor-middleware");

router.post(
  "/vendor/services",
  verifyToken,
  getVendor,
  service.createServiceByVendor
);
router.get(
  "/vendor/services",
  verifyToken,
  getVendor,
  service.getServicesByVendor
);
router.get(
  "/vendor/services/:id",
  verifyToken,
  getVendor,
  service.getOneServiceByVendor
);
router.put(
  "/vendor/services/:id",
  verifyToken,
  getVendor,
  service.updateServiceByVendor
);
router.delete(
  "/vendor/services/:id",
  verifyToken,
  getVendor,
  service.deleteServiceByVendor
);

module.exports = router;
