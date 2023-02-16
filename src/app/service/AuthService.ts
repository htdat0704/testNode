import argon2 from "argon2";
import User, { IUser } from "../model/User.js";
import cloudinary from "cloudinary";
import { StatusCodes } from "http-status-codes";
import ErrorHandler from "../../utils/errorHandler.js";

export const register = async (
  body: Partial<IUser>
): Promise<{ accessToken: string; newUserCreated: Partial<IUser> }> => {
  const userFound: IUser = await User.findOne({ email: body.email });

  if (userFound) {
    throw new ErrorHandler(
      "Email has been found in DB",
      StatusCodes.BAD_REQUEST
    );
  }

  const resultAvatar = await cloudinary.v2.uploader.upload(body.avatar.url, {
    folder: "qrCodes/avatar",
    width: 250,
    crop: "scale",
  });

  const user: Partial<IUser> = await User.create({
    email: body.email,
    name: body.name,
    apartment: body.apartment,
    password: await argon2.hash(body.password),
    role: body.role || "owner",
    avatar: {
      public_id: resultAvatar.public_id,
      url: resultAvatar.secure_url,
    },
  });

  return { accessToken: await user.createJWT(), newUserCreated: user };
};

export const login = async (
  email: string,
  password: string
): Promise<{ accessToken: string; userFound: IUser }> => {
  if (!email || !password) {
    throw new ErrorHandler(
      "Please enter email and password",
      StatusCodes.BAD_REQUEST
    );
  }

  const userFound: IUser = await User.findOne({ email: email }).select(
    "+password"
  );

  if (!userFound) {
    throw new ErrorHandler(
      "Email or Password not correct!",
      StatusCodes.BAD_REQUEST
    );
  }

  if (!(await userFound.comparePassword(password))) {
    throw new ErrorHandler(
      "Email or Password not correct!!",
      StatusCodes.BAD_REQUEST
    );
  }
  return { accessToken: await userFound.createJWT(), userFound };
};

// export const findUserById = async (idUser: string): Promise<boolean> => {
//   if()
// };
