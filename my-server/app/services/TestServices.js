const User = require("../model/User");
const QRCodeModel = require("../model/QRCode");
const QRCode = require("qrcode");
const cloudinary = require("cloudinary");
const datefn = require("date-fns");
const convertTimeToUTC = require("../../utils/convertTimeToUTC");
const crypto = require("crypto-js");

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
    avatar: {
      public_id: resultAvatar.public_id,
      url: resultAvatar.secure_url,
    },
    userId: user._id,
    apartment: user.apartment,
  });

  return await bodyQR.save();
};

exports.generateQR = async (QRId) => {
  let qrIdDecode = crypto.AES.encrypt(
    QRId.toString(),
    process.env.QR_SECRET
  ).toString();

  let qr = await QRCode.toDataURL(qrIdDecode);

  const result = await cloudinary.v2.uploader.upload(qr, {
    folder: "qrCodes/qr",
    width: 250,
    crop: "scale",
  });
  await QRCodeModel.findByIdAndUpdate(QRId, {
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
