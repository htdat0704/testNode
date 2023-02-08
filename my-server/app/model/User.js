const mongoose = require("mongoose");

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
  qrCode: [
    {
      idQR: {
        type: mongoose.Schema.ObjectId,
        ref: "qrCodes"
      }
    },
  ],
});

module.exports = mongoose.model("usersTest", UserSchema);
