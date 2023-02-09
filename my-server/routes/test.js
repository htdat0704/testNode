const espress = require("express");
const router = espress.Router();
const {
  isAuthenticatedUser,
  authorizeRole,
} = require("../app/middleware/auth");

// const { isTokenResetValid } = require("../app/middlewares/confirmReset");

const TestController = require("../app/controller/TestController");

// router.get('/details/:id', TestController.detailsProduct);
router.post(
  "/generate",
  isAuthenticatedUser,
  authorizeRole("owner", "admin"),
  TestController.generateQR
);
router.post(
  "/checkQR",
  isAuthenticatedUser,
  authorizeRole("security", "admin"),
  TestController.checkQR
);

router.get("/getQR", isAuthenticatedUser, TestController.getQR);
router.get(
  "/invalidQR",
  isAuthenticatedUser,
  authorizeRole("admin"),
  TestController.invalidQR
);

// router.get(
//   "/admin/generate",
//   isAuthenticatedUser,
//   authorizeRole("admin"),
//   TestController.generateQR
// );
router.get("/reader", isAuthenticatedUser, TestController.QRCodeReader);

module.exports = router;
