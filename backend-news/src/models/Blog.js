const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      index: true,
    },
    handle: {
      type: String,
      required: [true, 'Blog handle is required'],
      unique: true,
      index: true,
    },
    articles: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Article',
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
module.exports = Blog;