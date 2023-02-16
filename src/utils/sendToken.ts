const sendToken = (user, token, res) => {
  const options = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
