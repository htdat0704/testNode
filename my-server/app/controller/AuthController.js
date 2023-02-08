const AuthService = require("../services/AuthServices");
const UserService = require("../services/TestServices");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const sendToken = require("../../utils/sendToken");
const jwt = require("jsonwebtoken");

class AuthController {
  register = catchAsyncErrors(async (req, res, next) => {
    let userRegister = await UserService.findByName(req.body.email);

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

  login = catchAsyncErrors(async (req, res, next) => {
    let userLogin = await UserService.findByEmailForLogin(req.body.name);

    if (!userLogin) {
      return next(new ErrorHandler("User not found", 404));
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
}

module.exports = new AuthController();
