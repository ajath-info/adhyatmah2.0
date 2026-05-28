const express = require("express");
const router = express.Router();
const service = require("../../controllers/admin/service-controller");
const verifyToken = require("../../middlewares/jwt-middleware");
const { getAdmin } = require("../../middlewares/getAdmin-middleware");

router.post(
  "/admin/services",
  verifyToken,
  getAdmin,
  service.createServiceByAdmin
);
router.get(
  "/admin/services",
  verifyToken,
  getAdmin,
  service.getServicesByAdmin
);
router.get(
  "/admin/services/:id",
  verifyToken,
  getAdmin,
  service.getOneServiceByAdmin
);
router.put(
  "/admin/services/:id",
  verifyToken,
  getAdmin,
  service.updateServiceByAdmin
);
router.delete(
  "/admin/services/:id",
  verifyToken,
  getAdmin,
  service.deleteServiceByAdmin
);

module.exports = router;

