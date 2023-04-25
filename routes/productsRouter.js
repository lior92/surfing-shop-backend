const router = require('express').Router();
//middleware for upload images
const upload = require('../middleware/upload')

const adminAuth = require('../middleware/users_auth/adminAuth');

//The permissions have already been given in the database
//All the editor can do, the manager can do it
const editorAuth = require('../middleware/users_auth/editorAuth')


const { 
  addProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    update_product_quantity
} = require('../controllers/products_controller');


router.get('/all_products', getAllProducts);
router.get('/get_by_id/:product_id', getProductById);

//Restricted access only for editor and manager
router.post('/add_product',editorAuth, addProduct);
router.put('/update/:product_id',editorAuth, updateProduct);
router.delete('/delete/:product_id', deleteProduct)
router.put('/update_quantity',adminAuth,update_product_quantity)

module.exports = router;