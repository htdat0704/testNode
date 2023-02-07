const User = require("../model/User");

exports.searchDetail = async (id) => {
  return await User.findById(id).lean();
};
