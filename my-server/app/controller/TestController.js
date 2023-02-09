const TestService = require("../services/TestServices");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const QRCode = require("qrcode");
const Jimp = require("jimp");
const qrCodeReader = require("qrcode-reader");
const fs = require("fs");
const ErrorHandler = require("../../utils/errorhandler");
const datefn = require("date-fns");
const crypto = require("crypto-js");
const CronJob = require("cron").CronJob;

// new CronJob(
//   "* * * * *",
//   async () => {
//     const invalidQRs = await TestService.invalidQRCodes();
//     for (let qr of invalidQRs) {
//       await TestService.deleteQRCodes(qr);
//     }

//     console.log("Deleting expired QR.......");
//   },
//   true,
//   "Asia/Ho_Chi_Minh"
// );

class TestController {
  generateQR = catchAsyncErrors(async (req, res, next) => {
    let codeQR = await TestService.generateQRinDB(req.body, req.user._id);
    res.json({
      qr: await TestService.generateQR(codeQR._id),
      codeQRInformation: codeQR,
      success: true,
    });
  });

  checkQR = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.checkQR) {
      return next(new ErrorHandler("QR not found or expired!", 404));
    }

    var bytes = crypto.AES.decrypt(req.body.checkQR, process.env.QR_SECRET);

    var message_decode = bytes.toString(crypto.enc.Utf8);

    if (!message_decode) {
      return next(new ErrorHandler("QR not found or expired!!", 404));
    }

    const qrInformation = await TestService.findQR(message_decode);

    if (!qrInformation) {
      return next(new ErrorHandler("QR not found or expired!!!", 404));
    }

    res.json({
      qrInformation,
      success: true,
    });
  });

  getQR = catchAsyncErrors(async (req, res, next) => {
    for (let qr of req.user.qrCode) {
      console.log(new Date(qr.validDate));
      console.log(
        Math.abs(datefn.differenceInHours(new Date(qr.validDate), new Date()))
      );
    }

    res.json({
      qrCode: await TestService.getOneUserQRCodes(req.user._id),
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

    let string = "null";
    qrCodeInstance.callback = function (err, value) {
      if (err) {
        return next(new ErrorHandler("QR not found or expired", 404));
      }
      // __ Printing the decrypted value __ \\
      string = value.result;
      console.log(value.result);
      console.log(string);
    };
    let base64 = process.env.BASE64;

    //  buffer = fs.readFileSync(__dirname + "\\file.png");
    let qrcodeBuffer = Buffer.from(process.env.BASE64, "base64");

    const qrArray = getSync(qrcodeBuffer);

    qrcodeBuffer = jsQR(qrArray.data, qrArray.width, qrArray.height);

    const readQR = (buffer) =>
      Jimp.read(buffer, (err, image) => {
        if (err) {
          console.error(err);
        }
        // console.log(image.bitmap);
        qrCodeInstance.decode(image.bitmap);
      });

    readQR(qrcodeBuffer);
    res.json({
      success: true,
      string,
    });
  });
}

module.exports = new TestController();
