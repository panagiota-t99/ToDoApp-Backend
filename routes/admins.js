const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const adminsController = require('../controllers/admins');

router.post('/admin/login',adminsController.findAdmin);
module.exports = router;