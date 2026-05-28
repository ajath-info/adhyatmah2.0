const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    handle: {
      type: String,
      required: [true, 'Article handle is required'],
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
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
    blog: {
      type: mongoose.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
  },
  { timestamps: true }
);

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
module.exports = Article;