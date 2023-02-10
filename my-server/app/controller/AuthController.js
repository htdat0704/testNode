const AuthService = require("../services/AuthServices");
const UserService = require("../services/TestServices");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const sendToken = require("../../utils/sendToken");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const firebaseAdmin = require("firebase-admin");
const firebaseClient = require("../../config/firebase");

class AuthController {
  register = catchAsyncErrors(async (req, res, next) => {
    let userRegister = await UserService.findByEmail(req.body.email);

    if (userRegister) {
      return next(new ErrorHandler("Email has been taken", 400));
    }

    userRegister = await AuthService.register(req.body);

    const accessToken = jwt.sign(
      { userId: userRegister._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    sendToken(userRegister, accessToken, res);
  });

  registerWithFirebase = catchAsyncErrors(async (req, res, next) => {
    firebaseAdmin
      .auth()
      .createUser({
        email: req.body.email,
        password: req.body.password,
      })
      .then((createdUser) => {
        res.json({
          success: true,
          message: "User created success!",
          createdUser,
        });
      })
      .catch((exception) => {
        return next(new ErrorHandler(exception, 500));
      });
  });

  loginWithFirebase = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    let user = {};
    firebaseClient
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((authenticatedUser) => {
        user = authenticatedUser;
        return firebaseClient.auth().currentUser.getIdToken();
      })
      .then((result) => {
        sendToken({}, result, res);
      })
      .catch((exception) => {
        return next(new ErrorHandler(exception, 500));
      });
  });

  login = catchAsyncErrors(async (req, res, next) => {
    let userLogin = await AuthService.findByEmailForLogin(req.body.email);

    if (!userLogin) {
      return next(new ErrorHandler("Email not found", 404));
    }

    const passwordValid = await argon2.verify(
      userLogin.password,
      req.body.password
    );

    if (!passwordValid) {
      return next(new ErrorHandler("Username or Password invalid", 404));
    }

    const accessToken = jwt.sign(
      { userId: userLogin._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    sendToken(userLogin, accessToken, res);
  });

  logoutWithFirebase = catchAsyncErrors(async (req, res, next) => {
    await firebaseClient.auth().signOut();
    res.status(200);
    res.send({
      message: "You are logged out",
    });
  });
}

module.exports = new AuthController();
