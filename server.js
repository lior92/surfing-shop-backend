const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

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
    origin: ["http://localhost:3000", "http://localhost:3001","http://localhost:5173","http://localhost:5174"],
  })
);

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
