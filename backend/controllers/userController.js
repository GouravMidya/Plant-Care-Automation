const User = require('../models/User');

// Controller function to create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

// Controller function to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
};

// Controller function to get a single user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

// Controller function to update a user by ID
const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password, googleId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email, password, googleId }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    console.error('Error updating user by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

// Controller function to delete a user by ID
const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully', data: deletedUser });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
