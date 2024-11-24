// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require("../models/comment")
const { auth } = require('../middleware/auth');

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      userId: req.user.userId
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all posts with pagination
router.get('/', async (req, res) => {
    console.log("muzzammil")
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    console.log("Fetching posts...");
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'name' }
      });
      console.log("Fetched posts...");
    const total = await Post.countDocuments();
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/:postId/comments', auth, async (req, res) => {
    
  try {
    const comment = new Comment({
      ...req.body,
      userId: req.user.userId,
      postId: req.params.postId
    });
    await comment.save();
    
    const post = await Post.findById(req.params.postId);
    post.comments.push(comment._id);
    await post.save();
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;