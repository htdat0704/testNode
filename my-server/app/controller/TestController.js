const TestService = require("../services/TestServices");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Jimp = require("jimp");
const qrCodeReader = require("qrcode-reader");
const ErrorHandler = require("../../utils/errorHandler");
const crypto = require("crypto-js");
const CronJob = require("cron").CronJob;

new CronJob(
  "30 11 * * *",
  async () => {
    const invalidQRs = await TestService.invalidQRCodes();
    for (let qr of invalidQRs) {
      await TestService.deleteQRCodes(qr);
    }

    console.log("Deleting expired QR.......");
  },
  true,
  "Asia/Ho_Chi_Minh"
);

class TestController {
  generateQR = catchAsyncErrors(async (req, res, next) => {
    let codeQR = await TestService.generateQRinDB(req.body, req.user);

    res.json({
      qr: await TestService.generateQR(codeQR),
      codeQRInformation: codeQR,
      success: true,
    });
  });

  checkQR = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.checkQR) {
      return next(new ErrorHandler("QR not found or expired!", 403));
    }

    var bytes = crypto.AES.decrypt(req.body.checkQR, process.env.QR_SECRET);

    var message_decode = bytes.toString(crypto.enc.Utf8);

    if (!message_decode) {
      return next(new ErrorHandler("QR not found or expired!!", 403));
    }

    const qrInformation = await TestService.findQR(message_decode);

    if (!qrInformation) {
      return next(new ErrorHandler("QR not found or expired!!!", 403));
    }

    if (!qrInformation._id && !req.user._id) {
      return next(new ErrorHandler("USER NOT FOUND", 404));
    }

    await TestService.storeScanHistory(qrInformation, req.user._id);
    res.json({
      qrInformation,
      success: true,
    });
  });

  getQR = catchAsyncErrors(async (req, res, next) => {
    let qrCodes = await TestService.getOneUserQRCodes(req.user._id);
    if (qrCodes.length === 0) {
      return next(new ErrorHandler("Don't have QRCodes pls Update", 404));
    }

    res.json({
      qrCodes,
      success: true,
    });
  });

  invalidQR = catchAsyncErrors(async (req, res, next) => {
    res.json({
      qrCode: await TestService.invalidQRCodes(),
      success: true,
    });
  });

  QRCodeReader = catchAsyncErrors(async (req, res, next) => {
    const qrCodeInstance = new qrCodeReader();

    qrCodeInstance.callback = async (err, value) => {
      if (err) {
        return next(new ErrorHandler(err, 404));
      }
      // __ Printing the decrypted value __ \\

      var bytes = crypto.AES.decrypt(value.result, process.env.QR_SECRET);

      var message_decode = bytes.toString(crypto.enc.Utf8);

      if (!message_decode) {
        return next(new ErrorHandler("QR not found or expired!!", 404));
      }

      // const qrInformation = await TestService.findQR(message_decode);

      // if (!qrInformation) {
      //   return next(new ErrorHandler("QR not found or expired!!!", 404));
      // }

      return (await TestService.checkQRValid(JSON.parse(message_decode)._id))
        ? res.json({
            qrInformation: JSON.parse(message_decode),
            success: true,
          })
        : next(new ErrorHandler("QR not found or expired !!", 404));
    };
    // var buffer = fs.readFileSync(
    //   process.env.BASE64.replace(/^data:image\/(png|jpg);base64,/, "")
    // );

    var buffer = Buffer.from(
      req.body.base64QR.replace(/^data:image\/(png|jpg);base64,/, ""),
      "base64"
    );

    await Jimp.read(buffer, (err, image) => {
      if (err) {
        console.error(err);
      }
      // console.log(image.bitmap);
      qrCodeInstance.decode(image.bitmap);
    });
  });
}

module.exports = new TestController();
