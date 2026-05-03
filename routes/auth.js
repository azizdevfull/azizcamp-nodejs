///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Joi = require('joi');
const { signup, login } = require("../controllers/auth.controller");
const rateLimit = require("express-rate-limit");

const { check } = require("express-validator");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});


router.post("/signup", authLimiter, signup);

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", authLimiter, login);

router.get("/logout", (req, res) => {
  req.session.user = null
  res.redirect("/")
})

module.exports = router;
