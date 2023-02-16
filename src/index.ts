import express from "express";
dotenv.config();
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import route from "./routes/index.js";
import db from "./config/db/index.js";
import cloudinary from "cloudinary";
import errorMiddleware from "./app/middleware/ErrorMiddleware.js";
import cookieParser from "cookie-parser";
// import firebaseConfig from "./config/firebase";
// import serviceAccount from "./config/firebase/serviceAccountKey.json";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

db.connect();

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

const port: number | string = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
