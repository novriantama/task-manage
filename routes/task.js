const express = require("express");

const taskController = require("../controllers/task");
const isAuth = require("../middleware/is-auth");
const { route } = require("./auth");

const router = express.Router();

router.get("/", isAuth, taskController.getIndex);

module.exports = router;
