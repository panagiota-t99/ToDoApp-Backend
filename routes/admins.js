const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const adminsController = require('../controllers/admins');

router.post('/admin/login',adminsController.findAdmin);
router.get('/admin/user/:userid/lists',auth,adminsController.findUserLists);
router.get('/admin/user/:userid/lists/:listname',auth,adminsController.findUserListItems);
module.exports = router;