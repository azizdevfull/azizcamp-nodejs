///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Joi = require('joi');
const { signup, login } = require("../controllers/auth.controller");

const { check } = require("express-validator");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});


router.post("/signup",signup);

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", login);

router.get("/logout", (req, res) => {
  req.session.user = null
  res.redirect("/")
})

module.exports = router;
