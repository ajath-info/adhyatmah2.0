const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Collection title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      index: true,
    },
    handle: {
      type: String,
      required: [true, 'Collection handle is required'],
      unique: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      url: {
        type: String,
        required: [true, 'Image URL is required'],
      },
      altText: {
        type: String,
      },
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
      },
    ],
    viewAllUrl: {
      type: String,
      required: [true, 'View all URL is required'],
    },
  },
  { timestamps: true }
);

const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
module.exports = Collection;