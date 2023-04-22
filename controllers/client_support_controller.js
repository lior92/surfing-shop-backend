const Client_msg = require("../models/Client_Msg");

const jwt = require("jsonwebtoken");

module.exports = {
  sendMsg: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];


      if (!token) {
        throw new Error("Invalid token");
      }

      const { message, chat_status } = req.body;

      if (!message) {
        throw new Error("All fields are required");
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user_email = decode.user_email;
      const chat = await Client_msg.findOne({ user_email });

      if (chat) {
        //Use html
        chat.message = `<p>${chat.message}</p><p>${message}</p>`;
        await chat.save();
      } else {
        //Need also the email that manager will be able to recognize the user
        const new_message = new Client_msg({
          message,
          user_email,
          chat_status,
        });
        await new_message.save();
      }

      return res.status(201).json({
        success: true,
        message: "Success to send message",
        chat,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error sending message",
        error: error.message,
      });
    }
  },

  getMessage: async (req, res) => {
    console.log("client_support");
    try {
      //get all messages with current user_email from database


      console.log(req.headers)
      const token = req.headers.authorization.split(' ')[1];

      console.log(token)



      // console.log(token)
      if (!token) {
        throw new Error("Invalid token");
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user_email = decode.user_email;

      const my_chat = await Client_msg.find({ user_email });

      if (!my_chat) {
        throw new Error("Could not find my messages");
      }

      return res.status(200).json({
        success: true,
        my_chat,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  deleteMsg: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];


      if (!token) {
        throw new Error("Invalid token");
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user_email = decode.user_email;

      await Client_msg.findOneAndDelete({ user_email });

      return res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
        error: error,
      });
    }
  },
};
