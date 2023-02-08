const mongoose = require("mongoose");

const QRCodeSchema = new mongoose.Schema({
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
    name: {
      type: String,
    },
    relative: {
      type: String,
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

      
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "qrCodes"
        },
      
    createdAt: {
      type: Date,
      default: Date.now(),
    },
});

module.exports = mongoose.model("qrCodes", QRCodeSchema);
