const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const md5 = require("md5");

module.exports = class TokenManager {
  constructor({ config }) {
    this.config = config;
    this.authTokenExpiresIn = "24h";
  }

  _verifyToken({ token, secret }) {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.log(err);
    }
    return decoded;
  }

  genAuthToken(user) {
    return jwt.sign(user, this.config.dotEnv.AUTH_TOKEN_SECRET, {
      expiresIn: this.authTokenExpiresIn,
    });
  }

  verifyAuthToken(token) {
    return this._verifyToken({
      token,
      secret: this.config.dotEnv.AUTH_TOKEN_SECRET,
    });
  }
};
