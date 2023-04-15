///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router()
const AuthRouter = require("./auth")
const DreamRouter = require("./dreams")
const ProjectRouter = require("./projects")
const AttachmentRouter = require("./attachments")
const MessageBoardRouter = require("./message_boards")
const MessageRouter = require("./messages")
const TaskRouter = require('./tasks')
const checkUser = (req, res, next) => {
    const user = req.session.user;
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.redirect("/auth/signup");
    }
  }
  

  const redirectLoggedInUser = (req, res, next) => {
    const user = req.session.user;
    if (user) {
      res.redirect("/dashboard");
    } else {
      next();
    }
  };

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use("/auth",AuthRouter)
router.use("/dreams",checkUser, DreamRouter)
router.use("/projects",checkUser, ProjectRouter)
router.use("/",checkUser, AttachmentRouter)
router.use("/",checkUser, MessageBoardRouter)
router.use("/",checkUser, MessageRouter)
router.use("/",checkUser, TaskRouter)

///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", (req, res) => {
    res.render("home")
})

router.get("/dashboard",checkUser, (req, res) => {
    res.render("dashboard")
})

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router