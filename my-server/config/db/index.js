const mongo = require("mongoose");

async function connect() {
  try {
    await mongo.connect(
      "mongodb+srv://durand:123123123@cluster0.llxjqcl.mongodb.net/ecomerce?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connection Succes!!!");
  } catch (error) {
    console.log("Connection Failed!!!");
  }
}

module.exports = { connect };
