const User = require("../model/User");
const cloudinary = require("cloudinary");
const argon2 = require("argon2");

exports.register = async (body) => {
  const bodyRegister = {
    email: body.email,
    name: body.name,
    apartment: body.apartment,
    password: await argon2.hash(body.password),
    role: body.role || "owner",
    qrCode: [],
    avatar: {},
  };

  const resultAvatar = await cloudinary.v2.uploader.upload(body.avatar, {
    folder: "qrCodes/avatar",
    width: 250,
    crop: "scale",
  });

  bodyRegister.avatar = {
    public_id: resultAvatar.public_id,
    url: resultAvatar.secure_url,
  };

  return new User(bodyRegister).save();
};

exports.findById = async (id) => await User.findById(id).lean();

exports.findByEmailForLogin = async (email) =>
  await User.findOne({ email: email }).select("+password").lean();
