const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const userController = require('../controllers/users.js');
const { redirector } = require('../middleware.js');
const passport = require('passport');

router.route("/signup").
get(userController.showSignupForm).
post(redirector, wrapAsync(userController.userSignup));
router.route("/signin").
get(userController.showSigninForm).
post(redirector, userController.userSignin);
router.delete("/logout", userController.userLogout);
module.exports = router;