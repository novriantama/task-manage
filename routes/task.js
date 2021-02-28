const express = require("express");

const taskController = require("../controllers/task");
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validators");

const router = express.Router();

router.get("/", isAuth, taskController.getIndex);
router.post("/add-task", validate.addTask, isAuth, taskController.postAddTask);
router.delete("/delete-task/:id", isAuth, taskController.deleteTask);
router.post("/book-task", isAuth, taskController.postBookTask);
router.delete("/revoke-task/:id", isAuth, taskController.revokeTask);
router.get("/download-task/:id", isAuth, taskController.downloadTask);
module.exports = router;
