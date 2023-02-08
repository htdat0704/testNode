const User = require("../model/User");
const QRCodeModel = require("../model/QRCode");
const QRCode = require("qrcode");
const cloudinary = require("cloudinary");

exports.searchDetail = async (id) => {
  return await User.findById(id).lean();
};

exports.findByName = async (name) => {
  return await User.findOne({ name });
};

exports.getOneUserQRCodes = async (userId) => {
  return await QRCodeModel.find({userId});
}

exports.generateQRinDB = async (body, userId) => {
  const resultAvatar = await cloudinary.v2.uploader.upload(body.avatar, {
    folder: "qrCodes/avatar",
    width: 250,
    crop: "scale",
  });

  let bodyQR = new QRCodeModel({
    name: body.name,
    validDate: body.validDate,
    avatar: {
    public_id: resultAvatar.public_id,
    url: resultAvatar.secure_url,
    },
    userId,
    relative: body.relative
  })

  return await bodyQR.save();
};

exports.generateQR = async(QRId) => {
  // let qr = await QRCode.toDataURL(
  //   JSON.stringify({
  //     name: body.name,
  //     apartment: user.apartment,
  //     relative: body.relative,
  //     avatar: bodyQR.avatar.url,
  //     validDate: new Date(body.validDate),
  //   })
  // );

  let qr = await QRCode.toDataURL(
    QRId.toString()
  );

  const result = await cloudinary.v2.uploader.upload(qr, {
    folder: "qrCodes/qr",
    width: 250,
    crop: "scale",
  });

  await QRCodeModel.findByIdAndUpdate(QRId, {
    public_id: result.public_id,
    url: result.secure_url,
  })

  return result.secure_url;
}
