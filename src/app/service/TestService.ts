import QRCode, { IQRCode } from "../model/QRCode.js";
import cloudinary from "cloudinary";
import User, { IUser } from "../model/User.js";
import qrCodeReader from "qrcode-reader";
import ErrorHandler from "../../utils/errorHandler.js";
import crypto from "crypto-js";
import Jimp from "jimp";
import { decodeQR } from "../../utils/decodeQR.js";
import { ThrowStatement } from "typescript";

export const generateQR = async (
  body: IQRCode,
  user: Partial<IUser>
): Promise<{ qrCode: string; qrCodeInformation: IQRCode }> => {
  const resultAvatar = await cloudinary.v2.uploader.upload(body.avatar.url, {
    folder: "qrCodes/avatar",
    width: 250,
    crop: "scale",
  });

  const qrCode: IQRCode = await QRCode.create({
    ...body,
    avatar: {
      public_id: resultAvatar.public_id,
      url: resultAvatar.secure_url,
    },
    userId: user._id,
    apartment: user.apartment,
  });

  return { qrCode: await qrCode.createQR(), qrCodeInformation: qrCode };
};

export const readerQR = async (image: string, res, next): Promise<void> => {
  if (!image.includes("base64") || !image) {
    throw new ErrorHandler("Images not found", 404);
  }
  const qrCodeInstance = new qrCodeReader();
  qrCodeInstance.callback = async (err, value) => {
    if (err) {
      next(new ErrorHandler("Image not found or Not like base64", 404));
    }
    // __ Printing the decrypted value __ \\

    // const qrInformation = await TestService.findQR(message_decode);

    // if (!qrInformation) {
    //   return next(new ErrorHandler("QR not found or expired!!!", 404));
    // }

    !value
      ? next(new ErrorHandler("Image not found or Not like base64", 404))
      : res.json({
          qrInformation: JSON.parse(await decodeQR(value.result, next)),
          success: true,
        });
  };

  var buffer = Buffer.from(
    image.replace(/^data:image\/(png|jpg);base64,/, ""),
    "base64"
  );

  await Jimp.read(buffer, async (err, image) => {
    if (err) {
      next(new ErrorHandler("Image not found or Not like base64!", 404));
    }
    // if (!image) {
    //   new ErrorHandler("Image not found or Not like base64", 404);
    // }
    !image
      ? next(new ErrorHandler("Image not found or Not like base64", 404))
      : qrCodeInstance.decode(image.bitmap);
  });
};

export const findById = async (userId: string): Promise<IUser> => {
  return await User.findById(userId).lean();
};
