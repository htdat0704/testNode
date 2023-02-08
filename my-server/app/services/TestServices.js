const User = require("../model/User");
const QRCode = require("qrcode");
const cloudinary = require("cloudinary");

exports.searchDetail = async (id) => {
  return await User.findById(id).lean();
};

exports.findByName = async (name) => {
  return await User.findOne({ name });
};

exports.generateQR = async (body, user) => {
  let bodyQR = {
    apartment: user.apartment,
    name: body.name,
    validDate: body.validDate,
    avatar: {},
  };

  const resultAvatar = await cloudinary.v2.uploader.upload(body.avatar, {
    folder: "qrCodes/avatar",
    width: 250,
    crop: "scale",
  });

  bodyQR.avatar = {
    public_id: resultAvatar.public_id,
    url: resultAvatar.secure_url,
  };

  let qr = await QRCode.toDataURL(
    JSON.stringify({
      name: body.name,
      apartment: user.apartment,
      relative: body.relative,
      avatar: bodyQR.avatar.url,
      validDate: new Date(body.validDate),
    })
  );

  const result = await cloudinary.v2.uploader.upload(qr, {
    folder: "qrCodes/qr",
    width: 250,
    crop: "scale",
  });

  user.qrCode.push({
    validDate: new Date(body.validDate),
    public_id: result.public_id,
    url: result.secure_url,
  });

  await User.findByIdAndUpdate(user._id, { qrCode: user.qrCode });
  return User.findById(user._id);
};
