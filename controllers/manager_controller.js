const User = require("../models/User");
const bcrypt = require("bcrypt");
const Client_msg = require("../models/Client_Msg");


module.exports = {
  deleteUser: async (req, res) => {
    try {
      //get the user_id from input in client side
      const user_id = req.body.user_id;

      if (!user_id) {
        throw new Error("Invalid user_id");
      }

      await User.findByIdAndDelete(user_id);

      return res.status(201).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Problem deleting user",
        error: error.message,
      });
    }
  },
  addUser: async (req, res) => {
    try {
     
      const {
        user_name,
        user_password,
        user_email,
        user_phone,
        user_address,
        user_permission 
      } = req.body;

      // console.log(req.body);

      if (
        !user_name ||
        !user_password ||
        !user_email ||
        !user_phone ||
        !user_address ||
        !user_permission
      ) {
        throw new Error("all fields are required");
      }

      const hash = await bcrypt.hash(user_password, 12);

      const user = new User({
        user_name,
        user_password: hash,
        user_email,
        user_phone,
        user_address,
        //Only the manager can give permissions 
        user_permission,
      });

      await user.save();

      return res.status(201).json({
        success: true,
        message: "User saved successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      //get the user_id from input in client side
      const user_id = req.params.user_id;

      if (!user_id) {
        throw new Error("Invalid user_id");
      }

      // Hash the password if it is present in the request body
      if (req.body.user_password) {
        req.body.user_password = await bcrypt.hash(req.body.user_password, 10);
      }

      await User.findByIdAndUpdate(user_id, req.body);

      return res.status(201).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Cannot update",
        message: error.message,
      });
    }
  },

//Costumer support

getSupportMsg: async (req, res) => {
    try {
      const all_messages = await Client_msg.find();

      if (!all_messages) {
        throw new Error("No support messages");
      }

      return res.status(200).json({
        success: true,
        all_messages,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to get support message",
        error: error.message,
      });
    }
  },

sendSupportMsg:async(req,res)=>{
try {
  //The user email i'll get from getSupportMsg request (client side)
  const {message,user_email} = req.body

  if(!message||!user_email){
    throw new Error("All fields are required")
  }
   
  const chat = await Client_msg.findOne({user_email})

  if(chat){
    //Use html 
    chat.message = `
    <p>${chat.message}</p>
    <strong>Manager:${message}</strong>` 
  await chat.save();
  }
  

  return res.status(200).json({
    success: true,
    message:"Success to send support message back to client",
    chat
  })

} catch (error) {
  return res.status(500).json({
    error: error.message,
    message:"Field to send support message"
  })
}
},

changeStatus:async(req,res) =>{
  
try {
  
  const {user_email,chat_status} = req.body

  if(!user_email||!chat_status) {
    throw new Error("Bad credentials")
  }

const updated_user =  await Client_msg.findOneAndUpdate({user_email},{chat_status:chat_status})

  return res.status(201).json({
    success: true,
    message: "Success to change status",
    updated_user
  })

} catch (error) {
  console.log(error)

  return res.status(500).json({
    error: error,
    message: error.message
  })


}




},

deleteChat:async(req,res)=>{

  try {
    const user_email = req.body.user_email

    if(!user_email){
      throw new Error('Please enter a user email')
    }

  await Client_msg.findOneAndDelete({user_email})


    return res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    })


  } catch (error) {
    return res.status(500).json({
      error: error,
      message: error.message,
    })


  }


}

};
