//IMPORT
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true, //SUPPRIME LES ESPACES A LA FIN
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minLength: 6,
    },
    bio: {
      type: String,
      max: 1024,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
    following: {
      type: [String],
    },
    followers: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  { timestamps: true } //POUR CONNAITRE QUAND CA A ETE CREE ET MODIFIER
);

//Play function before save into display: 'block'
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
