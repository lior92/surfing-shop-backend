var express = require('express');
var router = express.Router();
const registeredAuth = require('../middleware/users_auth/registeredAuth');
const adminAuth = require('../middleware/users_auth/adminAuth');

const {
  getAllCarts,
  getUserCarts,
  addCart,
  deleteCart,
  
} = require('../controllers/carts_controller.js');


router.post('/add',registeredAuth, addCart);
router.post('/user_carts',registeredAuth ,getUserCarts);

router.get('/all',adminAuth,getAllCarts);
router.delete('/delete',adminAuth,deleteCart)


module.exports = router;
