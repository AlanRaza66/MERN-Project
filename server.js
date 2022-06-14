//Importation
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes")
require("./config/db");
// Récupère les variables d'environnement
require("dotenv").config({ path: "./config/.env" });
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

//Déclarer l'application Express
const app = express();
//Permet de lire les cookies
app.use(cookieParser());
//Permet de lire le body
app.use(bodyParser.json());
//Permet de lire les url
app.use(bodyParser.urlencoded({ extended: true }));

//jwt: assure la sécurité de la connexion de l'utilisateur pour chaque route
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

//server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
