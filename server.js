const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fs = require('fs');

const usersRouter = require("./routes/users_router");
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

const manager_areaRouter = require("./routes/manager_area_router");
const client_supportRouter = require("./routes/client_support_router");
const forgot_passwordRouter = require("./routes/forgot_password_router");

const app = express();

// app.use(cors())
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001","http://localhost:5173","http://localhost:5174","https://surfing-project.surge.sh"],
  })
);

// Set up the static directory for serving files
app.use(express.static(path.join(__dirname, "public")));

// Define a route for getting all the images in the uploads directory
app.get("/uploads", (req, res) => {
  // Use the fs module to read the contents of the uploads directory
  fs.readdir("./public/uploads", (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error getting images");
    } else {
      // Filter the files array to only include image files
      const images = files.filter(file => {
        return file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".gif");
      });
      
      // Send the list of image files in the response
      res.send(images);
    }
  });
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

app.use("/client_support", client_supportRouter);
app.use("/manager_area", manager_areaRouter);
app.use("/forgot_password", forgot_passwordRouter);


module.exports = app;
