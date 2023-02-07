// __ index.js __ \\
const express = require("express");
const app = express();
const QRCode = require("qrcode");
// __ Importing jimp __ \\
const Jimp = require("jimp");

// __ Importing filesystem = __ \\
const fs = require("fs");

// __ Importing qrcode-reader __ \\
const qrCodeReader = require("qrcode-reader");

const auth = require("./route");

app.use("/auth", auth);

let data = {
  apartment: "404",
  name: "Long",
  relative: "owner",
};

const myJSON = JSON.stringify(data);

let wait = async (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

let toFile = () =>
  QRCode.toFile(
    "my-server/file.png",
    ` ${myJSON}`,
    {
      errorCorrectionLevel: "H",
    },
    function (err) {
      if (err) throw err;
      console.log("QR code saved!");
    }
  );

const read = () => {
  const buffer = fs.readFileSync("my-server/file.png");
  Jimp.read(buffer, (err, image) => {
    if (err) {
      console.error(err);
    }
    // __ Creating an instance of qrcode-reader __ \\
    const qrCodeInstance = new qrCodeReader();

    qrCodeInstance.callback = function (err, value) {
      if (err) {
        console.error(err);
      }
      // __ Printing the decrypted value __ \\
      console.log(value.result);
    };

    // __ Decoding the QR code __ \\
    qrCodeInstance.decode(image.bitmap);
  });
};

const writeAndRead = async () => {
  toFile();
  await wait(2016);
  read();
};

writeAndRead();
// QRCode.toString('Encode this text in QR code', {
//     errorCorrectionLevel: 'H',
//     type: 'svg'
//   }, function(err, data) {
//     if (err) throw err;
//     console.log(data);
//   });
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
