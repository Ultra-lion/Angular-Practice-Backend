const express = require("express");
const router = express.Router();
const TourOfHeroes = require("../controllers/TourOfHeroesController");
const Middlewares = require("../Middlewares/SessionMiddlewares");

router.use(Middlewares.parseUserAgent);

router.post(
  "/login",
  [Middlewares.checkCookieSessionLogin],
  TourOfHeroes.login
);

router.post("/check/browser", [Middlewares.checkCookieSession], (req, res) => {
  res.status(200).send("allowed");
});

router.post("/logout", [Middlewares.checkCookieSession], TourOfHeroes.logout);

module.exports = router;
