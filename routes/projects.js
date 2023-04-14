///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const Project = require("../models/Project");
const auth = require("./authMiddleware");
const { create, show, edit, update, newProject, destroy } = require("../controllers/project.controller");

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

router.get("/new", newProject);

router.post("/", create);


router.get("/:id", show);

router.get("/:id/edit", edit);

router.put("/:id", update);

router.delete("/:id", destroy);

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
