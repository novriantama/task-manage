const express = require("express");

const authController = require("../controllers/auth");
const validate = require("../middleware/validators");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", validate.userLogin, authController.postLogin);

router.post("/signup", validate.userRegister, authController.postSignup);

router.post("/logout", authController.postLogout);

module.exports = router;
