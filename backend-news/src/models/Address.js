const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    address1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    province: {
      type: String,
      required: [true, "Province/State is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    zip: {
      type: String,
      required: [true, "ZIP/Postal code is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
AddressSchema.index({ customer: 1 });

const Address = mongoose.models.Address || mongoose.model("Address", AddressSchema);
module.exports = Address;
