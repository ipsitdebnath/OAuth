require("dotenv").config();

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const port = 3003;

const ClientID =
  "81258483199-9fik4mr6qfqav7vt0os2ccipi9d2sj64.apps.googleusercontent.com";
const ClientSecret = process.env.Client_secret;

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: ClientID,
      clientSecret: ClientSecret,
      callbackURL: "http://localhost:3003/callback",
    },
    (accessToken, refreshToken, profile, next) => {
      console.log(accessToken, profile);
      next(null, profile);
    },
  ),
);

app.get("/", (req, res) => {
  res.send(`<a href="/login">Login with google</a>`);
});

app.get("/login", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    session: false,
  }),
  (req, res) => {
    console.log(req.user);
    res.send(`Hi ${req.user.displayName}`);
  },
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});