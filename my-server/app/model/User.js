const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  relative: {
    type: String,
  },
  apartment: {
    type: String,
  },
});

module.exports = mongoose.model("usersTest", UserSchema);
