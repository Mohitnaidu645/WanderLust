import User from "../models/user.js";

export const createUser= async (req, res,next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
    });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", `Welcome, ${username} to WanderLust!`);
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

export const loginUser=async (req, res) => {
    let redirectUrl=res.locals.redirectUrl || "/listings";
    req.flash("success", "You are Loggedin");
    res.redirect(redirectUrl);
  };

export const logoutUser=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are LoggedOut !");
    res.redirect("/listings");
  });
};