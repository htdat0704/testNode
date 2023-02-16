import jwt from "jsonwebtoken";

import ErrorHandler from "../../utils/errorHandler.js";
import * as UserService from "../service/TestService.js";

export const isAuthenticatedUser = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = (authHeader && authHeader.split(" ")[1]) || req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("Please Login first", 404), 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as {
      userId: string;
    };

    req.user = await UserService.findById(decoded.userId);

    next();
  } catch (e) {
    return next(new ErrorHandler("Invalid Token", 404), 401);
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user);
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
