// __ route.js __ \\

const app = require("express");
const router = app.Router();

const authController = require("./controller");
router.post("/login", authController.login);
router.get("/test", authController.test);

module.exports = router;