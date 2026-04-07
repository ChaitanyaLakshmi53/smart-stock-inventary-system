const express = require('express');
const { updateInventory } = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/update', protect, updateInventory);

module.exports = router;
