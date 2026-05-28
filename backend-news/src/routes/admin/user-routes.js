const express = require("express");
const router = express.Router();
const admin = require("../../controllers/admin/admin-controller");
const verifyToken = require("../../middlewares/jwt-middleware");
const { getAdmin } = require("../../middlewares/getAdmin-middleware");

router.get("/admin/users", admin.getUsersByAdmin);
router.get(
  "/admin/users/:id",
  verifyToken,
  getAdmin,
  admin.getUserOrdersByAdmin
);
router.post(
  "/admin/users/role/:id",
  verifyToken,
  getAdmin,
  admin.updateUserRoleByAdmin
);
router.post(
  "/admin/users/status/:id",
  verifyToken,
  getAdmin,
  admin.updateUserStatusByAdmin
);

module.exports = router;
