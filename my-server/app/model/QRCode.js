const mongoose = require("mongoose");

const QRCodeSchema = new mongoose.Schema({
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
  dateExpired: {
    type: Date,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("qrCodes", QRCodeSchema);
