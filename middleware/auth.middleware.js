const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

//VERIFIE SI QUELQU'UN EST CONNECTE
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        res.local.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
      } else {
        let user = UserModel.findById(decodedToken.endsWith);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

//CONTROLE SI LE TOKEN CORRESPOND A QUELQU'UN
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    console.log("No token");
  }
};
