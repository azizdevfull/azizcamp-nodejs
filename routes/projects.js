///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const Project = require("../models/Projects");
const auth = require("./authMiddleware");

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(auth);

///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", async (req, res) => {
  const projects = await Project.find({ user: req.session.user.id });
  console.log(projects);
  res.render("projects/index", {
    projects,
  });
});

router.get("/new", async (req, res) => {
  res.render("projects/new");
});

router.post("/", async (req, res) => {
  req.body.user = req.session.user.id;
  await Project.create(req.body);
  res.redirect("/projects/");
});


router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const project = await Project.findOne({ _id: id, user: req.session.user.id });
  console.log(project)
  if (project) {
    res.render("projects/show", {
        project,
    });
  } else {
    res.status(400).json({ error: "No Project of This ID for this user" });
  }
});

router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const project = await Project.findOne({ _id: id, user: req.session.user.id });
  console.log(project)
  if (project) {
    res.render("projects/edit", {
        project,
    });
  } else {
    res.status(400).json({ error: "No Project of This ID for this user" });
  }
});

router.put("/:id", async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/projects");
});

router.delete("/:id", async (req, res) => {
  await Project.findByIdAndRemove(req.params.id);
  res.redirect("/projects");
});

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
