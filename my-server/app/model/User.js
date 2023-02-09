const mongoose = require("mongoose");
const { relative } = require("path");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
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
  apartment: {
    type: String,
  },
  role: {
    type: String,
    default: "owner",
  },
  scanHistory: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "qrCodes",
      },
      scanDate: {
        type: Date,
        default: Date.now(),
      },
      name: {
        type: String,
      },
      relative: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("usersTest", UserSchema);
