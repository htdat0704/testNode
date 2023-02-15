const User = require("../model/User");
const QRCodeModel = require("../model/QRCode");
const QRCode = require("qrcode");
const cloudinary = require("cloudinary");
const datefn = require("date-fns");
const convertTimeToUTC = require("../../utils/convertTimeToUTC");
const crypto = require("crypto-js");
const { async } = require("@firebase/util");

exports.searchDetail = async (id) => {
  return await User.findById(id).lean();
};

exports.findByName = async (name) => {
  return await User.findOne({ name });
};

exports.findByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.getOneUserQRCodes = async (userId) => {
  return await QRCodeModel.find({ userId });
};

exports.generateQRinDB = async (body, user) => {
  const resultAvatar = await cloudinary.v2.uploader.upload(body.avatar, {
    folder: "qrCodes/avatar",
    width: 250,
    crop: "scale",
  });

  let bodyQR = new QRCodeModel({
    name: body.name,
    validDate: body.validDate,
    relative: body.relative,
    duration: body.duration,
    avatar: {
      public_id: resultAvatar.public_id,
      url: resultAvatar.secure_url,
    },
    userId: user._id,
    apartment: user.apartment,
  });

  return await bodyQR.save();
};

exports.generateQR = async (QR) => {
  let qrIdDecode = crypto.AES.encrypt(
    JSON.stringify(QR),
    process.env.QR_SECRET
  ).toString();
  let qr = await QRCode.toDataURL(qrIdDecode);
  console.log(qr);
  const result = await cloudinary.v2.uploader.upload(qr, {
    folder: "qrCodes/qr",
    width: 250,
    crop: "scale",
  });
  await QRCodeModel.findByIdAndUpdate(QR._id, {
    public_id: result.public_id,
    url: result.secure_url,
  });
  return result.secure_url;
};

exports.storeScanHistory = async (qrInformation, security) => {
  const securityScanned = await User.findById(security._id);
  securityScanned.scanHistory
    ? securityScanned.scanHistory.push({
        userId: qrInformation.userId,
        name: qrInformation.name,
        relative: qrInformation.relative,
      })
    : (securityScanned.scanHistory = [
        {
          userId: qrInformation,
          name: qrInformation.name,
          relative: qrInformation.relative,
        },
      ]);
  await securityScanned.save();
};

exports.findQR = async (QRId) => {
  return await QRCodeModel.findById(QRId);
};

exports.invalidQRCodes = async () => {
  let qrCodes = await QRCodeModel.find().select("avatar public_id validDate");
  qrCodes = qrCodes.filter(
    (qr) =>
      datefn.differenceInHours(convertTimeToUTC(qr.validDate), new Date()) <= 1
  );

  return qrCodes;
};

exports.deleteQRCodes = async (qr) => {
  qr.avatar.public_id &&
    (await cloudinary.v2.uploader.destroy(qr.avatar.public_id));
  qr.public_id && (await cloudinary.v2.uploader.destroy(qr.public_id));
  await QRCodeModel.deleteOne({ _id: qr._id });
};

exports.checkQRValid = async (QRId) => {
  const qr = await QRCodeModel.findById(QRId);
  if (!qr) {
    return false;
  }

  return new Date().getTime() -
    (new Date(qr.createdAt).getTime() + 86400000 * qr.duration.getTime()) <
    0
    ? true
    : false;

  // console.log(new Date().getTime());
  // // console.log(new Date(new Date().getTime() + 86400000));
  // console.log(new Date(createdAt).getTime());
  // console.log(
  //   new Date(new Date(createdAt).getTime() + 86400000 * durationTime).getTime()
  // );
  // console.log(
  //   new Date().getTime() -
  //     new Date(
  //       new Date(createdAt).getTime() + 86400000 * durationTime
  //     ).getTime()
  // );
  // console.log(
  //   (new Date().getTime() -
  //     new Date(
  //       new Date(createdAt).getTime() + 86400000 * durationTime
  //     ).getTime()) /
  //     86400000
  // );
};
