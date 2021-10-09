module.exports = (req, res, next) => {
    const { username, password } = req.body;
  const valid = Boolean(username && password);

  if (!valid) {
    res.status(404).json({
      message: 'username and password required',
    });
  } else {
    next()
  }
};
  