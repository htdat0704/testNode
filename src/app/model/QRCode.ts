import mongoose from "mongoose";
import crypto from "crypto-js";
import QRCodeLib from "qrcode";

export interface IQRCode {
  _id: mongoose.Types.ObjectId;
  public_id: string;
  url: string;
  name: string;
  relative: string;
  avatar: {
    public_id: string;
    url: string;
  };
  validDate: Date;
  apartment: string;
  duration: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  createQR(): Promise<string>;
  checkValid(): Promise<boolean>;
}

const QRCodeSchema = new mongoose.Schema<IQRCode>({
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  relative: {
    type: String,
    require: true,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  validDate: {
    type: Date,
  },
  apartment: {
    type: String,
  },
  duration: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "qrCodes",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

QRCodeSchema.methods.createQR = async function (): Promise<string> {
  let qrIdDecode = crypto.AES.encrypt(
    JSON.stringify(this),
    process.env.QR_SECRET
  ).toString();

  let qr: Awaited<string> = await QRCodeLib.toDataURL(qrIdDecode);
  console.log(qr);
  return qr;
};

QRCodeSchema.methods.checkValid = async function (): Promise<boolean> {
  return new Date().getTime() -
    (new Date(this.createdAt).getTime() + 86400000 * this.duration.getTime()) <
    0
    ? true
    : false;
};

const QRCode = mongoose.model("qrCodes", QRCodeSchema);
export default QRCode;
