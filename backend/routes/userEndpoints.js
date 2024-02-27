const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/userController');

const router = express.Router();

// Create a new user
router.post('/', createUser);

// Get all users
router.get('/', getUsers);

// Get a user by ID
router.get('/:userId', getUserById);

// Update a user by ID
router.put('/:userId', updateUserById);

// Delete a user by ID
router.delete('/:userId', deleteUserById);

module.exports = router;
