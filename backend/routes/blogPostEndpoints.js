const express = require('express');
const { createBlogPost,
    getAllBlogPosts,
    getBlogPostByTitle,
    updateBlogPost,
    deleteBlogPost} = require('../controllers/blogController');

const router = express.Router();

// Insert Blog record
router.post('/', createBlogPost);

// Fetch All Blog records
router.get('/getall',getAllBlogPosts);

// Fetch a specific Blog record by ID
router.get('/', getBlogPostByTitle);

// Update a Blog record by ID
router.put('/', updateBlogPost);

// Delete a Blog record by ID
router.delete('/', deleteBlogPost);

module.exports = router;