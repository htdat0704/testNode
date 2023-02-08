const express = require("express");
const router = express.Router();
// const {
//   isAuthenticatedUser,
//   authorizeRole,
// } = require("../app/middlewares/auth");

const AuthController = require("../app/controller/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// router.get('/details/:id', TestController.detailsProduct);
// router.get('/', TestController.getAllProduct);

module.exports = router;
