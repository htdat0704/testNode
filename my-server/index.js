const express = require("express");
require("dotenv").config();
const app = express();
const route = require("./routes");
const errorMiddleware = require("./app/middleware/ErrorMiddleware");
const db = require("./config/db");
const firebaseConfig = require("./config/firebase");
const serviceAccount = require("./config/firebase/serviceAccountKey.json");
const cors = require("cors");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");
const firebaseAdmin = require("firebase-admin");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

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
app.use(cors());

route(app);

app.use(errorMiddleware);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
