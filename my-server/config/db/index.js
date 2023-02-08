const mongo = require("mongoose");
mongo.set("strictQuery", false);

async function connect() {
  try {
    await mongo.connect(
      "mongodb+srv://durand:123123123@cluster0.llxjqcl.mongodb.net/ecomerce?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connection Success!!!");
  } catch (error) {
    console.log("Connection Failed!!!");
  }
}

module.exports = { connect };
