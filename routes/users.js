const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const usersController = require('../controllers/users');

router.post('/users/login', usersController.findUser);
router.post('/users/register', usersController.addUser);
router.get('/users/role', auth, usersController.findRole);
router.get('/users/lists', auth, usersController.findAllLists);
router.get('/users/all', auth, usersController.findAllUsers);
router.put('/users/update', auth, usersController.updateUser);
router.delete('/users/delete/:id', auth, usersController.deleteUser);
module.exports = router;
