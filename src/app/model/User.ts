import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  avatar: {
    url?: string;
    public_id?: string;
  };
  apartment: string;
  role: string;
  createJWT(): Promise<string>;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    require: true,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  apartment: {
    type: String,
  },
  role: {
    type: String,
    default: "owner",
  },
});

UserSchema.methods.createJWT = async function (): Promise<string> {
  const accessToken = jwt.sign(
    { userId: this._id },
    process.env.ACCESS_TOKEN_SECRET
  );
  return accessToken;
};

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const passwordValid = await argon2.verify(this.password, password);
  this.password = null;
  return passwordValid;
};

const User = mongoose.model("usersTest", UserSchema);
export default User;
