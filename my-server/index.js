// __ index.js __ \\
const express = require("express");
const app = express();
// __ Importing jimp __ \\

// __ Importing filesystem = __ \\

// __ Importing qrcode-reader __ \\
const route = require("./routes");
const errorMiddleware = require("./app/middleware/ErrorMiddleware");
const db = require("./config/db");
const cors = require("cors");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");
require("dotenv").config();

db.connect();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  express.urlencoded({
    extended: true,
    limit: "25mb",
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
// let wait = async (ms) => {
//   return new Promise((r) => setTimeout(r, ms));
// };
// QRCode.toString('Encode this text in QR code', {
//     errorCorrectionLevel: 'H',
//     type: 'svg'
//   }, function(err, data) {
//     if (err) throw err;
//     console.log(data);
//   });
app.use(cors());

route(app);

app.use(errorMiddleware);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
