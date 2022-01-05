const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const logsController = require('../controllers/logs');

router.get('/logs/:user', auth, logsController.getLogs);
module.exports = router;
