const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const Review = require("../../models/Review");
const Blog = require("../../models/Blog");
const Collection = require("../../models/Collection");
const CouponCode = require("../../models/CouponCode");
const Policy = require("../../models/Policy");
const Settings = require("../../models/Settings");
const Service = require("../../models/Service");
const Shop = require("../../models/Shop");

function ok(res, key, extra = {}) {
  return res.json({ success: true, key, ...extra });
}

module.exports = {
  // GET endpoints
  getHomepageCollections: async (req, res) => ok(res, "getHomepageCollections"),
  blogs: async (req, res) => ok(res, "blogs"),
  getBanner: async (req, res) => ok(res, "getBanner"),
  allMenus: async (req, res) => ok(res, "allMenus"),
  getProductAttributes: async (req, res) => ok(res, "getProductAttributes", { id: req.query.id || null }),
  allCollections: async (req, res) => ok(res, "allCollections", { page: req.query.page ? Number(req.query.page) : 1 }),
  getReviewData: async (req, res) => ok(res, "getReviewData", { id: req.query.id || null }),
  getLandingPage: async (req, res) => ok(res, "getLandingPage"),
  getViewAllData: async (req, res) => ok(res, "getViewAllData"),
  getPolicies: async (req, res) => ok(res, "getPolicies"),
  getCustomerAddresses: async (req, res) => ok(res, "getCustomerAddresses"),
  getContactInfo: async (req, res) => ok(res, "getContactInfo"),
  getCustomerProfile: async (req, res) => ok(res, "getCustomerProfile"),
  getFilterCollectionData: async (req, res) => ok(res, "getFilterCollectionData"),
  getCoupons: async (req, res) => ok(res, "getCoupons"),
  getCart: async (req, res) => ok(res, "getCart"),
  customerAllOrders: async (req, res) => ok(res, "customerAllOrders"),
  getWishlist: async (req, res) => ok(res, "getWishlist"),
  getProfileImage: async (req, res) => ok(res, "getProfileImage"),
  getPaymentMethods: async (req, res) => ok(res, "getPaymentMethods"),
  getOrderById: async (req, res) => ok(res, "getOrderById"),
  getSearchTypes: async (req, res) => ok(res, "getSearchTypes"),
  search: async (req, res) => ok(res, "search"),
  getFAQs: async (req, res) => ok(res, "getFAQs"),
  getYoutubeUrl: async (req, res) => ok(res, "getYoutubeUrl"),
  filterCollection: async (req, res) => ok(res, "filterCollection"),
  getMasterCollectionProducts: async (req, res) => ok(res, "getMasterCollectionProducts"),
  getShippingUrls: async (req, res) => ok(res, "getShippingUrls"),
  getIndianStates: async (req, res) => ok(res, "getIndianStates"),

  // POST endpoints
  createCustomer: async (req, res) => ok(res, "createCustomer"),
  login: async (req, res) => ok(res, "login"),
  logoutCustomer: async (req, res) => ok(res, "logoutCustomer"),
  forgotPassword: async (req, res) => ok(res, "forgotPassword"),
  createCustomerAddress: async (req, res) => ok(res, "createCustomerAddress"),
  addToWishlist: async (req, res) => ok(res, "addToWishlist"),
  createCart: async (req, res) => ok(res, "createCart"),
  updateCart: async (req, res) => ok(res, "updateCart"),
  removeCart: async (req, res) => ok(res, "removeCart"),
  updateCustomerProfile: async (req, res) => ok(res, "updateCustomerProfile"),
  upload: async (req, res) => ok(res, "upload"),
  createCodOrder: async (req, res) => ok(res, "createCodOrder"),
  initializePayment: async (req, res) => ok(res, "initializePayment"),
  applyCoupon: async (req, res) => ok(res, "applyCoupon"),
  clearCartStore: async (req, res) => ok(res, "clearCartStore"),
  verifyPaymentAndCreateOrder: async (req, res) => ok(res, "verifyPaymentAndCreateOrder"),
  filterCollectionPost: async (req, res) => ok(res, "filterCollectionPost"),

  // PUT endpoints
  updateCustomerAddress: async (req, res) => ok(res, "updateCustomerAddress"),

  // DELETE endpoints
  deleteCustomerAddress: async (req, res) => ok(res, "deleteCustomerAddress"),
  removeFromWishlist: async (req, res) => ok(res, "removeFromWishlist"),
  cancelCustomerOrder: async (req, res) => ok(res, "cancelCustomerOrder"),
  removeCoupon: async (req, res) => ok(res, "removeCoupon"),
  deleteCustomer: async (req, res) => ok(res, "deleteCustomer"),
};



