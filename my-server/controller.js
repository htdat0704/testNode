// __ controller.js __\\

exports.login = async (req, res) => {
  try {
    // __ Extract the secret from the request body. __ \\
    const secret = req.body.secret;
    // __ Validate the secret. __ \\

    if (secret === VALID_SECRET) {
      // __ Generate a JWT token. __ \\
      const token = jwt.sign({ user: "example" }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // __ Send the JWT token to the client. __ \\
      res.json({ token });
    } else {
      // __ If the secret is invalid, return an error. __ \\
      res.status(401).json({ error: "Invalid QR code" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.test = async (req, res) => {
  console.log("Hitting the test route");
  return res.status(200).json({ message: "Hitting the test route" });
};
