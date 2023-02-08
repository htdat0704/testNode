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
    name: body.name,
    validDate: body.validDate,
    avatar: {},
    relative: body.relative
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

  user.qrCode.push({
    ...bodyQR,
  });

  const userUpdated = await User.findByIdAndUpdate(user._id, { qrCode: user.qrCode }).select("qrCode");

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
    userUpdated.qrCode[userUpdated.qrCode.length-1]._id.toString()
  );

  const result = await cloudinary.v2.uploader.upload(qr, {
    folder: "qrCodes/qr",
    width: 250,
    crop: "scale",
  });

  userUpdated.qrCode.forEach(qr => {
    if (qr._id.toString() === userUpdated.qrCode[userUpdated.qrCode.length]._id.toString()) {
      qr.public_id = result.public_id
      qr.url = result.secure_url
    }
 });
  
  await userUpdated.save({validateBeforeSave: false})
  return User.findById(user._id);
};
