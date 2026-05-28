const express = require("express");
const router = express.Router();
const revenueController = require("../../controllers/vendor/revenue-controller");
const verifyToken = require("../../middlewares/jwt-middleware");
const { getVendor } = require("../../middlewares/getVendor-middleware");

/**
 * @route   GET /api/vendor/revenue/summary
 * @desc    Get revenue summary for vendor
 * @access  Private (Vendor)
 * @params  period (query) - time period: today, yesterday, week, month, year, all
 * @params  customStart (query) - custom start date (ISO string)
 * @params  customEnd (query) - custom end date (ISO string)
 * @example GET /api/vendor/revenue/summary?period=month
 * @example GET /api/vendor/revenue/summary?customStart=2024-01-01&customEnd=2024-01-31
 */
router.get(
  "/vendor/revenue/summary",
  verifyToken,
  getVendor,
  revenueController.getRevenueSummary
);

/**
 * @route   GET /api/vendor/revenue/analytics
 * @desc    Get detailed revenue analytics for vendor
 * @access  Private (Vendor)
 * @params  period (query) - time period: today, yesterday, week, month, year, all
 * @params  customStart (query) - custom start date (ISO string)
 * @params  customEnd (query) - custom end date (ISO string)
 * @params  groupBy (query) - grouping: day, week, month, year (default: day)
 * @example GET /api/vendor/revenue/analytics?period=month&groupBy=day
 * @example GET /api/vendor/revenue/analytics?customStart=2024-01-01&customEnd=2024-01-31&groupBy=week
 */
router.get(
  "/vendor/revenue/analytics",
  verifyToken,
  getVendor,
  revenueController.getRevenueAnalytics
);

/**
 * @route   GET /api/vendor/revenue/products
 * @desc    Get revenue breakdown by products for vendor
 * @access  Private (Vendor)
 * @params  period (query) - time period: today, yesterday, week, month, year, all
 * @params  customStart (query) - custom start date (ISO string)
 * @params  customEnd (query) - custom end date (ISO string)
 * @params  limit (query) - number of products per page (default: 50)
 * @params  page (query) - page number (default: 1)
 * @example GET /api/vendor/revenue/products?period=month&limit=20&page=1
 * @example GET /api/vendor/revenue/products?customStart=2024-01-01&customEnd=2024-01-31&limit=10
 */
router.get(
  "/vendor/revenue/products",
  verifyToken,
  getVendor,
  revenueController.getRevenueByProduct
);

/**
 * @route   GET /api/vendor/revenue/export
 * @desc    Export revenue data for vendor
 * @access  Private (Vendor)
 * @params  period (query) - time period: today, yesterday, week, month, year, all
 * @params  customStart (query) - custom start date (ISO string)
 * @params  customEnd (query) - custom end date (ISO string)
 * @params  format (query) - export format: json, csv (default: json)
 * @example GET /api/vendor/revenue/export?period=month&format=csv
 * @example GET /api/vendor/revenue/export?customStart=2024-01-01&customEnd=2024-01-31&format=json
 */
router.get(
  "/vendor/revenue/export",
  verifyToken,
  getVendor,
  revenueController.exportRevenueData
);

module.exports = router;
