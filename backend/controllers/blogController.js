const BlogPost = require('../models/blogPostModel');

// Controller function to create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const blogPost = new BlogPost({ title, content, author: authorId });
    const savedPost = await blogPost.save();
    res.status(201).json({ success: true, message: 'Blog post created successfully', data: savedPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ success: false, message: 'Failed to create blog post' });
  }
};

// Controller function to get all blog posts
const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: blogPosts });
  } catch (error) {
    console.error('Error getting blog posts:', error);
    res.status(500).json({ success: false, message: 'Failed to get blog posts' });
  }
};

// Controller function to get a single blog post by Title
const getBlogPostByTitle = async (req, res) => {
    try {
      const { title } = req.query;
      console.log(title)
      const blogPost = await BlogPost.findOne({ title });
      if (!blogPost) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      res.status(200).json({ success: true, data: blogPost });
    } catch (error) {
      console.error('Error getting blog post by title:', error);
      res.status(500).json({ success: false, message: 'Failed to get blog post' });
    }
  };
  
// Controller function to update a blog post by Title
const updateBlogPost = async (req, res) => {
    try {
      const { title } = req.query;
      const updatedFields = req.body;
      console.log(title,updatedFields)
      // Find the blog post by title and update it
      const updatedPost = await BlogPost.findOneAndUpdate({ title }, { ...updatedFields, updatedAt: Date.now() }, { new: true });
  
      if (!updatedPost) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
  
      res.status(200).json({ success: true, message: 'Blog post updated successfully', data: updatedPost });
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ success: false, message: 'Failed to update blog post' });
    }
  };
  
// Controller function to delete a blog post by ID
const deleteBlogPost = async (req, res) => {
  try {
    const { title } = req.query;
    const deletedPost = await BlogPost.findOneAndDelete({title});
    if (!deletedPost) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.status(200).json({ success: true, message: 'Blog post deleted successfully', data: deletedPost });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog post' });
  }
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostByTitle,
  updateBlogPost,
  deleteBlogPost
};
