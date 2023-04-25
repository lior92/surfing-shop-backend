const Product = require("../models/Product");
const Cart = require("../models/Cart");
const fs = require('fs');
const path = require("path");

module.exports = {
  getAllProducts: async (req, res) => {

    try {
      const products = await Product.find();

      return res.status(200).json({
        success: true,
        message: "success to get all products",
        products,
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "error in get all products request",
        error: error.message,
      });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product_id = req.params.product_id;

      const product = await Product.findById(product_id);

      if (!product) {
        throw new Error("Product not found");
      }

      return res.status(200).json({
        success: true,
        message: "success to get product by id",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        message: "error in get product by id request",
        error: error.message,
      });
    }
  },
  addProduct: async (req, res) => {
    try {
      const {
        product_name,
        product_price,
        product_description,
        product_category,
      } = req.body;
  
      if (!product_name || !product_price || !product_category || !product_description ) {
        throw new Error("required fields are missing");
      }
  
console.log(req.file.path)

      // read the uploaded image file as a buffer
      const imageBuffer = fs.readFileSync(req.file.path);
  
console.log(imageBuffer)

      // convert the buffer to base64
      const imageBase64 = imageBuffer.toString('base64');
  
console.log(imageBase64)

      // create a new product object with the base64-encoded image
      const new_product = new Product({
        product_category,
        product_name,
        product_price,
        product_description: product_description || "",
        product_image: `data:${req.file.mimetype};base64,${imageBase64}`,
      });
  
      // save the new product to the database
      await new_product.save();
  
      // delete the uploaded image file from the server
      fs.unlinkSync(req.file.path);
  
      return res.status(200).json({
        success: true,
        message: "success to add new product",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "error in add product request",
        error: error.message,
      });
    }
  },
  

updateProduct: async (req, res) => {
    try {
      const product_id = req.params.product_id;
      if (!product_id) {
        throw new Error("Product ID must be provided");
      }

      //Make it optional
      let url_image;
      if (req.file) {
        url_image = `https://surf-shop.onrender.com/uploads/${req.file.filename}`;
        // url_image = `http://localhost:4000/uploads/${req.file.filename}`;
        req.body.product_image = url_image;
      }

      await Product.findByIdAndUpdate(product_id, req.body);

      return res.status(200).json({
        success: true,
        message: "success to update product",
      });
    } catch (error) {
      // console.log(error)
      return res.status(500).json({
        message: "error in update product request",
        error: error.message,
      });
    }
  },
  
  update_product_quantity:async(req,res)=>{
    try { 
      const {quantity,cart_id , product_id} = req.body

    const updated_cart = await Cart.findById(cart_id).populate('cart_products.product');

    const product_index = updated_cart.cart_products.findIndex((product) => {
      return product.product._id.toString() === product_id;
    });

    if (product_index === -1) {
      throw new Error('Product not found in cart');
    }

//Update the quantity    
updated_cart.cart_products[product_index].quantity = quantity

    await updated_cart.save();

return res.status(200).json({
  success: true,
  message:"successfully updated"
  ,updated_cart
})

    } catch (error) {
      
      return res.status(500).json({
        message:"Failed to update",
        error: error.message,
      })
    }
 },

 deleteProduct: async (req, res) => {
  try {
    const { product_id } = req.params;

    // find the product by id
    const product = await Product.findById(product_id);

    if (!product) {
      throw new Error("product not found");
    }

    // delete the product from the database
    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in delete product request",
      error: error.message,
    });
  }
}




};
