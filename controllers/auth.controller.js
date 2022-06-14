//inscription, connexion, deconnexion
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};
module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(200).send({ err });
  }
};

module.exports.signIn = (req, res) => {
  const { email, password } = req.body;
  //CHERCHER L'UTILISATEUR
  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) res.status(401).json({ error: "Incorrect email" });
      //COMPARER MOT DE PASSE
      bcrypt.compare(password, user.password).then((auth) => {
        if (!auth) res.status(404).json({ error: "Incorrect password" });
        res.cookie("jwt", createToken(user._id), { httpOnly: true, maxAge });
        res.status(200).json({ user: user._id });
      });
    })
    .catch((error) => res.status(500).json(error));
};


module.exports.logOut = (req, res) => {
  res.cookie('jwt','',{maxAge: 1});
  res.redirect('/');
};
