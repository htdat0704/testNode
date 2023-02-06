// __ index.js __ \\
const express = require("express");
const app = express();
const QRCode = require('qrcode');

const auth = require("./route");

app.use("/auth", auth);

// QRCode.toFile('/output-file-path/file.png', 'Encode this text in QR code', {
//     errorCorrectionLevel: 'H'
//   }, function(err) {
//     if (err) throw err;
//     console.log('QR code saved!');
//   });

QRCode.toString('Encode this text in QR code', {
    errorCorrectionLevel: 'H',
    type: 'svg'
  }, function(err, data) {
    if (err) throw err;
    console.log(data);
  });
const port = process.env.PORT || 3001;
app.listen(port, () => {
console.log(`Listening to port ${port}...`);
});