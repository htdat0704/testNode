const express = require("express");
const router = express.Router();
const { isAuthenticatedUserByFirebase } = require("../app/middleware/auth");

const AuthController = require("../app/controller/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/testAuth", isAuthenticatedUserByFirebase, (req, res, next) =>
  res.json({ success: true })
);

router.post("/registerFirebase", AuthController.registerWithFirebase);
router.post("/loginFirebase", AuthController.loginWithFirebase);

// router.get('/details/:id', TestController.detailsProduct);
// router.get('/', TestController.getAllProduct);

module.exports = router;
