require("dotenv").config();
const express = require("express");
const mongoose = require("./db/connection");
const { log } = require("mercedlogger");
const methodOverride = require("method-override");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || "3000";
const SECRET = process.env.SECRET || "secret"
const HomeRouter = require("./routes/home.js");
const session = require("express-session");
const connect = require("connect-mongodb-session")(session)
// const path = require('path');


const app = express();

// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// app.use(require('ejs-yield'))

app.use(cors())
app.use(methodOverride("_method"))
app.use(express.static("public"))
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    saveUninitialized: true,
    resave: true,
    store: new connect({
      uri: process.env.MONGODB_URL,
      databaseName: "sessions",
      collection: "sessions",
    }),
  })
);


app.use("/", HomeRouter);


app.listen(PORT, () =>
  log.white("🚀 Server Launch 🚀", `Listening on Port ${PORT}`)
);