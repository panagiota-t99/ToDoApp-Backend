const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const listsController = require('../controllers/lists');

router.get('/lists/items/:listid', auth, listsController.findAllItems);
router.put('/lists/list', auth, listsController.updateListName);
router.put('/lists/item', auth, listsController.updateItemName);
router.delete('/lists/list/:listid', auth, listsController.deleteList);
router.delete('/lists/list/item/:itemsid', auth, listsController.deleteItem);
router.post('/lists/list/add', auth, listsController.addList);
router.post('/lists/list/item/add', auth, listsController.addItem);
module.exports = router;