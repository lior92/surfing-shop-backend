const router = require("express").Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");



router.post("/", async (req, res) => {
  try {
    user_email = req.body.user_email;

    //Make new password for user that matches to /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ (the match in the User model)
    const generatePassword = () => {
      const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      let password = "";
      while (password.length < 8) {
        const randomChar = Math.floor(Math.random() * letters.length);
        password += letters.charAt(randomChar);
        if (password.length < 8) {
          const randomNum = Math.floor(Math.random() * numbers.length);
          password += numbers.charAt(randomNum);
        }
      }
      return password;
    };
    //Put the return value into the new_password variable 
    const new_password = generatePassword();

    //Before sending, hash and update the password in database
    const hash = await bcrypt.hash(new_password, 12);
    const user = await User.findOneAndUpdate({ user_email },{ user_password: hash });

    if (!user) {
      throw new Error("Bad credentials");
    }

    //Function that responsible to send email
    const message = () => {
      return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com", // SMTP (Simple Mail Transfer Protocol)
          //Using port 587 ensures secure and authenticated email transmission between an email client and server.  port: 587,
          secure: false, // use TLS (Transport Layer Security)
          auth: {
            user: "liorasaf92@gmail.com",
            //Create special coded password for nodemailer in google apps () or take from .env
            pass: process.env.GOOGLE_APPS_KEY,
          },
        });

        const mail = {
          from: "liorasaf92@gmail.com",
          to: `${user_email}`,
          subject: "new password",
          text: `${new_password}`,
        };

        transporter.sendMail(mail, (err, data) => {
          if (err) {
            console.log(err)
            return reject({
              message: err.message,
            });
          }
          return resolve({
            message: "email successfully sent",
          });
        });
      });
    };

    const response = await message();
    const message2 = await response.message;

    return res.status(201).json({
      success: true,
      message2,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
