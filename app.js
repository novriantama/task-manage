const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const seq = require("./util/database");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("csurf");
const sqliteStore = require("connect-session-sequelize")(session.Store);

const User = require("./models/user");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
const csrfProtection = csrf();

app.use(
  session({
    secret: "secret",
    store: new sqliteStore({
      db: seq,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRoutes);
app.use(taskRoutes);

seq
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
