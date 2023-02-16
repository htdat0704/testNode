import { register, login } from "../service/AuthService.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendToken from "../../utils/sendToken.js";
class AuthController {
  login = catchAsyncErrors(async (req, res, next) => {
    const { accessToken, userFound } = await login(
      req.body.email,
      req.body.password
    );
    sendToken(userFound, accessToken, res);
  });
  register = catchAsyncErrors(async (req, res, next) => {
    const { accessToken, newUserCreated } = await register({
      ...req.body,
      avatar: {
        url: req.body.avatar,
      },
    });
    sendToken(newUserCreated, accessToken, res);
  });
}

export default new AuthController();
