const express = require("express");
const path = require("path");
const fs = require('fs');
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
dotenv.config();


const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const cartRouter = require("./routes/cart");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const profileRouter = require("./routes/profile");
const orderRouter = require("./routes/order");
const comment_productRouter = require("./routes/comment_product");
const rating_productRouter = require("./routes/rating_product");
const transaction_historyRouter = require("./routes/transaction_history");

const app = express();

const uploadDir = "image";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/image", express.static(path.join(__dirname, "image")));


app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/profile", profileRouter);
app.use("/order", orderRouter);
app.use("/comment_product", comment_productRouter);
app.use("/rating_product", rating_productRouter);
app.use("/transaction_history", transaction_historyRouter);

module.exports = app;
