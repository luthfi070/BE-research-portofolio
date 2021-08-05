function verifyToken(req, res, next) {
  let token = req.headers["authorization"];

  if (token) {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = verifyToken;
