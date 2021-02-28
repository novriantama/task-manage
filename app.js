const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const seq = require("./util/database");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("csurf");
const sqliteStore = require("connect-session-sequelize")(session.Store);
const multer = require("multer");
const methodOverride = require("method-override");

const User = require("./models/user");
const Task = require("./models/task");
const AssignTask = require("./models/assign-task");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("zips"));
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "zips");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/zip") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("zip"));

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

app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("_method"));
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

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

User.belongsToMany(Task, { through: AssignTask });
Task.belongsToMany(User, { through: AssignTask });
User.hasMany(AssignTask);
AssignTask.belongsTo(User);
Task.hasMany(AssignTask);
AssignTask.belongsTo(Task);

seq
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
