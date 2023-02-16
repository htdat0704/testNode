import express from "express";
import TestController from "../app/controller/TestController.js";
import { isAuthenticatedUser } from "../app/middleware/auth.js";

const router = express.Router();
router.post("/generate", isAuthenticatedUser, TestController.generateQR);
router.post("/reader", isAuthenticatedUser, TestController.readerQR);

export default router;
