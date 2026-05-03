///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const User = require("../models/User");
const Project = require("../models/Project");
const auth = require("./authMiddleware");
const rateLimit = require("express-rate-limit");
const { create, show, edit, update, newProject, destroy } = require("../controllers/project.controller");

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(auth);

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", readLimiter, async (req, res) => {
  const projects = await Project.find({ user: req.session.user.id });
  console.log(projects);
  res.render("projects/index", {
    projects,
  });
});

router.get("/new", newProject);

router.post("/", writeLimiter, create);


router.get("/:id", show);

router.get("/:id/edit", edit);

router.put("/:id", writeLimiter, update);

router.delete("/:id", writeLimiter, destroy);

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
