///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router()
const AuthRouter = require("./auth")
const DreamRouter = require("./dreams")


const checkUser = (req, res, next) => {
    const user = req.session.user;
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.redirect("/auth/login");
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
router.use("/auth",redirectLoggedInUser,AuthRouter)
router.use("/dreams",checkUser, DreamRouter)

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