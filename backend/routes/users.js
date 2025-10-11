// backend/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAdminKey = require('../middleware/adminKey');

// GET /api/users
router.get('/', userController.getUsers);

// POST /api/users/add  (requires admin key)
router.post('/add', requireAdminKey, userController.addUser);

// POST /api/users/update (requires admin key)
router.post('/update', requireAdminKey, userController.updateUser);

// POST /api/users/delete (requires admin key)
router.post('/delete', requireAdminKey, userController.deleteUser);

// GET /api/users/me  (session simulation)
router.get('/me', userController.getCurrentUser);

module.exports = router;
