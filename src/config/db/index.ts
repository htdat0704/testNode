import mongo from "mongoose";
mongo.set("strictQuery", false);

async function connect() {
  try {
    await mongo.connect(
      "mongodb+srv://durand:123123123@cluster0.llxjqcl.mongodb.net/ecomerce?retryWrites=true&w=majority"
    );
    console.log("Connection Success!!!");
  } catch (error) {
    console.log("Connection Failed!!!");
  }
  // try {
  //   await mongo.connect(
  //     "mongodb+srv://durand:123123123@cluster0.kllganq.mongodb.net/testDurand?retryWrites=true&w=majority",
  //     {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     }
  //   );
  //   console.log("Connection Success!!!");
  // } catch (error) {
  //   console.log("Connection Failed!!!");
  // }
}

export default { connect };
