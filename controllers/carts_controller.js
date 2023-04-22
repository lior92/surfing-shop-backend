const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

module.exports = {
  getAllCarts: async (req, res) => {
    try {
      const carts = await Cart.find().populate(["cart_products.product"]);

      return res.status(200).json({
        success: true,
        message: "success to get all carts",
        carts,
      });
    } catch (error) {
      return res.status(500).json({
        message: "error in get all carts",
      });
    }
  },
  getUserCarts: async (req, res) => {
    try {
      const user_id = req.body.user_id;

      if (!user_id) {
        throw new Error("User id not provided");
      }

      const user_carts = await Cart.find({ user: user_id }).populate(
        "cart_products.product"
      );

      if (!user_carts) {
        throw new Error("User not found");
      }

      return res.status(200).json({
        success: true,
        message: "Got user carts",
        user_carts,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error to get user carts",
        error: error.message,
      });
    }
  },
  addCart: async (req, res) => {
    try {

      
      const { user_objId, cart_products } = req.body;
 

      await User.findById(user_objId);

      const products = await Product.find();

      const answer_arr = cart_products.filter((cart_product) => {
        return !products.some(
          (product) => product._doc._id.toString() === cart_product.product
        );
      });

      if (answer_arr.length > 0) {
        throw new Error("was problem with the ids of the products");
      }

      const new_cart = new Cart({
        user_objId,
        cart_products,
      });

      await new_cart.save();
      
      //!update also the user
      let cart = {
        cart: new_cart._id,
      };
    let user =  await User.findByIdAndUpdate(user_objId,{$push:{user_carts:cart}},{new:true}).populate({
      path: 'user_carts.cart',
      populate: {
        path: 'cart_products.product',
        model: 'products'
      }
    });


      return res.status(200).json({
        success: true,
        message: "success to add cart successfully",
        user
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "error in add cart",
        error: error.message,
      });
    }
  },
  deleteCart: async (req, res) => {
    try {
      const cart_id = req.body.cart_id;

      if (!cart_id) {
        throw new Error("Cart not found");
      }

      await Cart.findByIdAndDelete(cart_id);

      return res.status(200).json({
        success: true,
        message: "Cart deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete",
        error: error.message,
      });
    }
  },
};
