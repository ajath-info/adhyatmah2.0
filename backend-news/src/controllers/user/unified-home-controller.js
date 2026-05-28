const mongoose = require("mongoose");
const BrandModel = require("../../models/Brand");
const Category = require("../../models/Category");
const Product = require("../../models/Product");
const Review = require("../../models/Review");
const Settings = require("../../models/Settings");
const User = require("../../models/User");

// Helper function to get products with variants and reviews
const getProductsWithVariants = async (matchQuery, limit = 8) => {
  return await Product.aggregate([
    { $match: matchQuery },
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
    { $sort: { sold: -1 } },
    { $limit: limit },
    {
      $project: {
        images: 1,
        name: 1,
        slug: 1,
        discount: 1,
        likes: 1,
        type: 1,
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
};

// Helper function to get products for a specific category
const getCategoryProducts = async (categoryId, limit = 4) => {
  return await Product.aggregate([
    {
      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
        status: "published",
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
    { $sort: { sold: -1 } },
    { $limit: limit },
    {
      $project: {
        images: 1,
        name: 1,
        slug: 1,
        discount: 1,
        likes: 1,
        type: 1,
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
};

// Main unified home API
const getUnifiedHomeData = async (req, res) => {
  try {
    // Fetch all data in parallel for better performance
    const [bannersData, categoriesData, vendorsData, reviewsData] =
      await Promise.all([
        // 1. Banners and slides
        Settings.findOne().select("home"),

        // 2. All active categories for homepage
        Category.find({ status: "active" })
          .select(["name", "cover", "slug", "status"])
          .sort({ name: 1 }),

        // 3. Best Pandits/Vendors (top 4 for homepage)
        User.find({ role: "vendor" })
          .select(
            "firstName lastName email phone about services cover address city language gotra experience"
          )
          .populate({
            path: "services",
            select: "poojaType description duration price",
          })
          .limit(4),

        // 4. Reviews/Testimonials (limited to 8)
        Review.aggregate([
          { $sort: { rating: -1, createdAt: -1 } },
          { $group: { _id: "$user", review: { $first: "$$ROOT" } } },
          { $replaceRoot: { newRoot: "$review" } },
          { $limit: 8 },
        ]).exec(),
      ]);

    // Populate reviews with user data
    await Review.populate(reviewsData, {
      path: "user",
      select: ["firstName", "lastName", "cover", "gender", "city", "country"],
    });

    // Format vendors data to match expected frontend structure
    const formattedVendors = vendorsData.map((vendor) => ({
      id: vendor._id.toString(),
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      email: vendor.email,
      phone: vendor.phone,
      about: vendor.about ?? null,
      services: vendor.services
        ? vendor.services.map((service) => ({
            id: service._id.toString(),
            poojaType: service.poojaType,
            description: service.description,
            duration: service.duration,
            price: service.price,
          }))
        : [],
      image: vendor.cover ?? null,
      address: vendor.address ?? null,
      language: vendor.language ?? null,
	  gotra: vendor.gotra ?? null,
      experience: vendor.experience ?? null,
	  city: vendor.city ?? null,
    }));

    // Get products for each category and nest them inside
    const categoriesWithProducts = await Promise.all(
      categoriesData.map(async (category) => {
        const products = await getCategoryProducts(category._id, 8);
        return {
          _id: category._id.toString(),
          name: category.name,
          cover: category.cover,
          slug: category.slug,
          status: category.status,
          products: products || [],
        };
      })
    );

    // Prepare the unified response with new structure
    const unifiedData = {
      banners: {
        slides: bannersData?.home?.slides || [],
        banner1: bannersData?.home?.banner1 || {},
        banner2: bannersData?.home?.banner2 || {},
        banner3: bannersData?.home?.banner3 || {},
      },
      categories: categoriesWithProducts || [],
      featuredProducts: [], // Legacy support - can be removed later
      bestSellingProducts: [], // Legacy support - can be removed later
      topRatedProducts: [], // Legacy support - can be removed later
      vendors: formattedVendors || [],
      reviews: reviewsData || [],
      collectionsWithProducts: [], // Legacy support - can be removed later
    };

    res.status(200).json({
      success: true,
      data: unifiedData,
    });
  } catch (error) {
    console.error("Error in unified home controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unified home data",
      error: error.message,
    });
  }
};

module.exports = {
  getUnifiedHomeData,
};
