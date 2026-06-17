import express from "express";
import passport from "passport";
const router = express.Router();

import * as usersController from "../controllers/users.js";
import {saveRedirectUrl} from "../middleware.js"

router.get("/signup", (req, res) => {
  res.render("./Users/signup.ejs");
});

//createUser
router.post("/signup",usersController.createUser);

//login
router.get("/login",(req, res) => {
  res.render("./Users/login.ejs");
});
router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),usersController.loginUser);

//logout
router.get("/logout",usersController.logoutUser);

export default router;
