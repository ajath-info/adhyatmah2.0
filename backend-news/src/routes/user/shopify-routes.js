const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user/shopify-controller");

// Base: /shopify

// GET endpoints
router.get("/shopify/getHomepageCollections", ctrl.getHomepageCollections);
router.get("/shopify/blogs", ctrl.blogs);
router.get("/shopify/getBanner", ctrl.getBanner);
router.get("/shopify/allMenus", ctrl.allMenus);
router.get("/shopify/getProductAttributes", ctrl.getProductAttributes); // ?id=
router.get("/shopify/allCollections", ctrl.allCollections); // ?page=
router.get("/shopify/getReviewData", ctrl.getReviewData); // ?id=
router.get("/shopify/getLandingPage", ctrl.getLandingPage);
router.get("/shopify/getViewAllData", ctrl.getViewAllData);
router.get("/shopify/getPolicies", ctrl.getPolicies);
router.get("/shopify/getCustomerAddresses", ctrl.getCustomerAddresses);
router.get("/shopify/getContactInfo", ctrl.getContactInfo);
router.get("/shopify/getCustomerProfile", ctrl.getCustomerProfile);
router.get("/shopify/getFilterCollectionData", ctrl.getFilterCollectionData);
router.get("/shopify/getCoupons", ctrl.getCoupons);
router.get("/shopify/getCart", ctrl.getCart);
router.get("/shopify/customerAllOrders", ctrl.customerAllOrders);
router.get("/shopify/getWishlist", ctrl.getWishlist);
router.get("/shopify/getProfileImage", ctrl.getProfileImage);
router.get("/shopify/getPaymentMethods", ctrl.getPaymentMethods);
router.get("/shopify/getOrderById", ctrl.getOrderById);
router.get("/shopify/getSearchTypes", ctrl.getSearchTypes);
router.get("/shopify/search", ctrl.search);
router.get("/shopify/getFAQs", ctrl.getFAQs);
router.get("/shopify/getYoutubeUrl", ctrl.getYoutubeUrl);
router.get("/shopify/filterCollection", ctrl.filterCollection);
router.get("/shopify/getMasterCollectionProducts", ctrl.getMasterCollectionProducts);
router.get("/shopify/getShippingUrls", ctrl.getShippingUrls);
router.get("/shopify/getIndianStates", ctrl.getIndianStates);

// POST endpoints
router.post("/shopify/createCustomer", ctrl.createCustomer);
router.post("/shopify/login", ctrl.login);
router.post("/shopify/logoutCustomer", ctrl.logoutCustomer);
router.post("/shopify/forgotPassword", ctrl.forgotPassword);
router.post("/shopify/createCustomerAddress", ctrl.createCustomerAddress);
router.post("/shopify/addToWishlist", ctrl.addToWishlist);
router.post("/shopify/createCart", ctrl.createCart);
router.post("/shopify/updateCart", ctrl.updateCart);
router.post("/shopify/removeCart", ctrl.removeCart);
router.post("/shopify/updateCustomerProfile", ctrl.updateCustomerProfile);
router.post("/shopify/upload", ctrl.upload);
router.post("/shopify/createCodOrder", ctrl.createCodOrder);
router.post("/shopify/initializePayment", ctrl.initializePayment);
router.post("/shopify/applyCoupon", ctrl.applyCoupon);
router.post("/shopify/clearCartStore", ctrl.clearCartStore);
router.post("/shopify/verifyPaymentAndCreateOrder", ctrl.verifyPaymentAndCreateOrder);
router.post("/shopify/filterCollection", ctrl.filterCollectionPost);

// PUT endpoints
router.put("/shopify/updateCustomerAddress", ctrl.updateCustomerAddress);

// DELETE endpoints
router.delete("/shopify/deleteCustomerAddress", ctrl.deleteCustomerAddress);
router.delete("/shopify/removeFromWishlist", ctrl.removeFromWishlist);
router.delete("/shopify/cancelCustomerOrder", ctrl.cancelCustomerOrder);
router.delete("/shopify/removeCoupon", ctrl.removeCoupon);
router.delete("/shopify/deleteCustomer", ctrl.deleteCustomer);

module.exports = router;



