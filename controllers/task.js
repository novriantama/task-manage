exports.getIndex = (req, res, next) => {
  res.render("task/index", {
    pageTitle: "Task",
    path: "/",
  });
};
