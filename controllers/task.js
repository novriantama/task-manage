const Task = require("../models/task");
const AssignTask = require("../models/assign-task");
const { validationResult } = require("express-validator");

exports.getIndex = (req, res, next) => {
  Task.findAll({
    where: {
      isDeleted: 0,
    },
    include: AssignTask,
  }).then((result) => {
    return res.render("task/index", {
      pageTitle: "Task Management",
      user: req.user,
      errorMessage: null,
      task: result,
    });
  });
};

exports.postAddTask = (req, res, next) => {
  const name = req.body.name;
  const zip = req.file;
  const errors = validationResult(req);
  if (!zip) {
    Task.findAll({
      where: {
        isDeleted: 0,
      },
      include: AssignTask,
    }).then((result) => {
      return res.status(422).render("task/index", {
        pageTitle: "Task Management",
        user: req.user,
        errorMessage: "Attached file is not a zip.",
        task: result,
      });
    });
  } else if (!errors.isEmpty()) {
    Task.findAll({
      where: {
        isDeleted: 0,
      },
      include: AssignTask,
    }).then((result) => {
      return res.status(422).render("task/index", {
        pageTitle: "Task Management",
        user: req.user,
        errorMessage: errors.array()[0].msg,
        task: result,
      });
    });
  } else {
    const zipUrl = zip.path;

    Task.create({
      name: name,
      location: zipUrl,
    }).then(() => {
      return res.redirect("/");
    });
  }
};

exports.deleteTask = (req, res, next) => {
  const id = req.params.id;
  Task.update(
    {
      isDeleted: 1,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postBookTask = (req, res, next) => {
  const taskId = req.body.taskId;
  const userId = req.user.id;
  AssignTask.create({
    taskId: userId,
    userId: userId,
  }).then(() => {
    return res.redirect("/");
  });
};

exports.revokeTask = (req, res, next) => {
  const id = req.params.id;
  AssignTask.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.downloadTask = (req, res, next) => {
  const id = req.params.id;
  Task.findOne({ where: { id: id } }).then((result) => {
    res.download(result.location);
  });
};
