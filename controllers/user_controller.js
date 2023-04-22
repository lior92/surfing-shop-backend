const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  registerUser: async (req, res) => {
    try {

      const {
        user_name,
        user_password,
        user_password_confirm,
        user_email,
        user_phone,
        user_address,
      } = req.body;

      if (
        !user_name ||
        !user_password ||
        !user_password_confirm ||
        !user_email ||
        !user_phone ||
        !user_address
      ) {
        throw new Error("all fields are required");
      }

      if (user_password !== user_password_confirm) {
        throw new Error("passwords do not match");
      }
      const hash = await bcrypt.hash(user_password, 12);

      const user = new User({
        user_name,
        user_password: hash,
        user_email,
        user_phone,
        user_address,
        //note: user permission allowed to be sended only from manager route (security issues)
      });

      await user.save();

      return res.status(201).json({
        success: true,
        message: "User saved successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error.message,
      });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { user_email, user_password } = req.body;

      if (!user_email || !user_password) {
        throw new Error("All fields are required");
      }

      const user = await User.findOne({ user_email }).populate({
        path: "user_carts.cart",
        populate: {
          path: "cart_products.product",
          model: "products",
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(user_password, user.user_password);

      if (!isMatch) {
        throw new Error("Bad credentials");
      }

      //because i didn't pull yet from database
      const { user_name, user_address, user_permission, user_phone, _id } =
        user;

      //making payload for token
      const payload = {
        _id,
        user_name,
        user_password,
        user_email,
        user_address,
        user_phone,
        //send user_permission for use him in the users authentications middleware
        user_permission,
      };

      //create token with sign
      //Note Set-Cookie header have some limitations characters. Don`t put to much payload data in the payload

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1H",
      });

      //!Important
      //expiresIn: "1H": validation fot x time
      // { maxAge: 10000 }: delete token from cookie after x time

      res.cookie("token", token, { maxAge: 60 * 60 * 1000 }); // 1 hour

      return res.status(200).json({
        success: true,
        message: "User Login Success",
        user,
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Invalid credentials",
        error: error.message,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const user_id = req.params.user_id;

      if (!user_id) {
        throw new Error("User not found");
      }

      const user = await User.findById(user_id).populate({
        path: "user_carts.cart",
        populate: {
          path: "cart_products.product",
          model: "products",
        },
      });
      // console.log(user)

      return res.status(200).json({
        success: true,
        message: "Success to get user",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error getting user",
        error: error.message,
      });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate("user_carts.cart");

      if (!users) {
        throw new Error("Failed to find users");
      }

      return res.status(200).json({
        success: true,
        message: "Success to get users",
        users,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error getting users",
        error: error.message,
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user_id = req.body.user_id;


      if (!user_id) {
        throw new Error("User id must be provided");
      }

      //Conditionally** This section for case that the user wants to change the password
      let user_password = req.body.user_password;
      if (user_password) {
        // find the user and take the new password for compare
        const user = await User.findById(user_id)

        // if the new password is different from the old one, hash it and update req.body
        const isMatch = user_password == user.user_password;
        if (!isMatch) {
          user_password = await bcrypt.hash(user_password, 12);
          req.body.user_password = user_password;
        }
      }

      // save the modifications in the database
      await User.findByIdAndUpdate(user_id, req.body)

//Important to pull the user after the update is complete
      const user = await User.findById(user_id)

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating user",
        error: error.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user_id = req.body.user_id;

      if (!user_id) {
        throw new Error("Must provide a user id");
      }

      await User.findByIdAndRemove(user_id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete user",
        error: error.message,
      });
    }
  },
  authToken: async (req, res) => {
 

    
    //check if token exists in the cookie
    try {

      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        throw new Error("No token provided");
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decode._id).populate({
        path: "user_carts.cart",
        populate: {
          path: "cart_products.product",
          model: "products",
        },
      });

      // res.cookie("token", token);

      return res.status(200).json({
        success: true,
        // token,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "authorized",
        error: error.message,
      });
    }
  },
};
