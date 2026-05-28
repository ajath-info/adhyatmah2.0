const mongoose = require("mongoose");

const VendorReviewSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required."],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required."],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required."],
      index: true,
      unique: true,
    },
    review: {
      type: String,
      required: [true, "Review is required."],
      maxlength: [1000, "Review cannot exceed 1000 characters."],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required."],
      min: 1,
      max: 5,
    },
    images: [
      {
        url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const VendorReview =
  mongoose.models.VendorReview || mongoose.model("VendorReview", VendorReviewSchema);
module.exports = VendorReview;


