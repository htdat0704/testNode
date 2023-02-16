import crypto from "crypto-js";
import ErrorHandler from "./errorHandler.js";

export const decodeQR = async (encode: string, next): Promise<string> => {
  var bytes = crypto.AES.decrypt(encode, process.env.QR_SECRET);

  var message_decode = bytes.toString(crypto.enc.Utf8);

  if (!message_decode) {
    next(new ErrorHandler("QR not found or expired!!", 404));
  }

  return message_decode;
};
