const TestService = require("../services/TestServices");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const QRCode = require("qrcode");
const Jimp = require("jimp");
const qrCodeReader = require("qrcode-reader");
const fs = require("fs");
const ErrorHandler = require("../../utils/errorhandler");
const jsQR = require("jsqr");
const { getSync } = require("@andreekeberg/imagedata");
const datefn = require("date-fns");

class TestController {
  generateQR = catchAsyncErrors(async (req, res, next) => {
    let user = await TestService.generateQR(req.body, req.user);

    res.json({
      user,
      success: true,
    });
  });

  getQR = catchAsyncErrors(async (req, res, next) => {
    for(let qr of req.user.qrCode){
      console.log(new Date(qr.validDate),)
      console.log(Math.abs(datefn.differenceInHours(new Date(), new Date(qr.validDate) )))
    }
    res.json({
      qrCode: req.user.qrCode,
      success: true,
    });
  })

  QRCodeReader = catchAsyncErrors(async (req, res, next) => {
    const qrCodeInstance = new qrCodeReader();

    let string = "null";
    qrCodeInstance.callback = function (err, value) {
      if (err) {
        return new ErrorHandler("Error QR", 403);
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
