///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const Dream = require("../models/Dreams");
const auth = require("./authMiddleware");
const rateLimit = require("express-rate-limit");

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(auth);

const dreamsWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 write requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

const dreamsReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 read requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", async (req, res) => {
  const dreams = await Dream.find({ user: req.session.user.id });
  console.log(dreams);
  res.render("dreams/index", {
    dreams,
  });
});

router.post("/", async (req, res) => {
  req.body.user = req.session.user.id;
  await Dream.create(req.body);
  res.redirect("/dreams/");
});

router.get("/:id", dreamsReadLimiter, async (req, res) => {
  const id = req.params.id;
  const dream = await Dream.findOne({ _id: id, user: req.session.user.id });
  console.log(dream)
  if (dream) {
    res.render("dreams/show", {
      dream,
    });
  } else {
    res.status(400).json({ error: "No Dream of This ID for this user" });
  }
});

router.put("/:id", dreamsWriteLimiter, async (req, res) => {
  const allowedFields = ["title", "description", "dream"];
  const updates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates[field] = req.body[field];
    }
  }

  await Dream.findOneAndUpdate(
    { _id: req.params.id, user: req.session.user.id },
    { $set: updates },
    { runValidators: true }
  );
  res.redirect("/dreams");
});

router.delete("/:id", async (req, res) => {
  await Dream.findByIdAndRemove(req.params.id);
  res.redirect("/dreams");
});

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
