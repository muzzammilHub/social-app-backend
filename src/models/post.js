// models/Post.js
const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    mediaUrl: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  });
  
  const Post = mongoose.model('Post', postSchema);

  module.exports = Post