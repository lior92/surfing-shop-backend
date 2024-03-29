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
        product_image
      } = req.body;


      if (!product_name || !product_price || !product_category || !product_description || !product_image) {
        throw new Error("required fields are missing");
      }

      // create a new product object with the base64-encoded image
      const new_product = new Product({
        product_category,
        product_name,
        product_price,
        product_description: product_description || "",
        product_image
      });
  
      // save the new product to the database
      await new_product.save();
  
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
  

      let product_image;
      if (req.body.product_image) {
        product_image = req.body.product_image;
      }


      await Product.findByIdAndUpdate(product_id, req.body);
  
      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to update product",
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
