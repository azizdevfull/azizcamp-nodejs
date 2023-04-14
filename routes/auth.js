///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Joi = require('joi');
///////////////////////////////
// Router Specific Middleware
////////////////////////////////

///////////////////////////////
// Router Routes
////////////////////////////////

// SIGNUP "/auth/signup"
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

const signupSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/signup', async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    if (newUser) {
      req.session.user = {
        username: newUser.username,
        id: newUser._id,
      };
      return res.redirect('/dashboard');
    }
    return res.status(500).json({ error: 'Unable to create user' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});
// Login "/auth/login"
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  try {
    // First Stop, does the user exist
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        req.session.user = {
          username: user.username,
          id: user._id,
        };
        res.redirect("/dashboard")
      } else {
        res.status(400).json({ error: "Password Does Not Match" });
      }
    } else {
      res.status(400).json({ error: "User Does Not Exist" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// logout
router.get("/logout", (req, res) => {
  req.session.user = null
  res.redirect("/")
})

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
