///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const Dream = require("../models/Dreams");
const auth = require("./authMiddleware");

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(auth);

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

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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
