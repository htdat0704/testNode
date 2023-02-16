import * as TestService from "../service/TestService.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../utils/errorHandler.js";

class TestController {
  generateQR = catchAsyncErrors(async (req, res) => {
    const { qrCode, qrCodeInformation } = await TestService.generateQR(
      {
        ...req.body,
        avatar: {
          url: req.body.avatar,
        },
      },
      req.user
    );
    res.json({
      qrCode,
      qrCodeInformation,
      success: true,
      message: "ok",
    });
  });
  readerQR = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.base64QR) {
      next(new ErrorHandler("Image not found", 404));
    }
    req.body.base64QR &&
      (await TestService.readerQR(req.body.base64QR, res, next));
  });
  register = async (req, res, next) => {
    res.json({
      success: true,
      message: "ok",
    });
  };
}

export default new TestController();
