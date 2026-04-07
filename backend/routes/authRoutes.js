const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');
const { adminOnly: roleAdminOnly } = require('../middleware/role');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, roleAdminOnly, getUsers);

module.exports = router;
