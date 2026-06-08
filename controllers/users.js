const UserModel = require('../Models/userModel.js');
const expressError = require('../utils/expressError.js');
const passport = require('passport');

module.exports.showSignupForm = (req,res) => {
    res.render("register/signup");
};
module.exports.userSignup= async(req,res,next) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new UserModel({email, username}); 
        let addedUser = await UserModel.register(newUser, password);
        req.login(addedUser, (err) => {
            if (err) {
                return next(err);
            }
            let redirectUrl = res.locals.redirectUrl || "/listings";
            req.flash("flashMsg", "Successfully signed up!");
            req.flash("optType", "success");
            res.redirect(redirectUrl);
        });
    } catch (err) {
        req.flash("flashMsg", err.message);
        req.flash("optType", "error");
        return res.redirect("/signup");
    }
};
module.exports.showSigninForm = (req,res) => {
    res.render("register/signin");
};
module.exports.userSignin = (req, res, next) => {
    passport.authenticate("local", (error,user,info) => {
        if(error) {
            req.flash("flashMsg", error.message);
            req.flash("optType", "error");
            return res.redirect("/signin");
        }
        if(!user) {
            req.flash("flashMsg", info ? info.message : "Invalid username or password");
            req.flash("optType", "error");
            return res.redirect("/signin");
        }
        req.logIn(user, error => {
            if(error) {
                req.flash("flashMsg", error.message);
                req.flash("optType", "error");
                return res.redirect("/signin");
            }
            req.flash("flashMsg", "Successfully logged in!");
            req.flash("optType", "success");
            let redirectUrl = res.locals.redirectUrl || "/listings";
            return res.redirect(redirectUrl);
        });
    })(req,res,next)
};
module.exports.userLogout  =(req,res,next) => {
    req.logOut(err => {
        if(err) {
            next(err);
        }
        req.flash("flashMsg", "Successfully logged out!");
        req.flash("optType", "success");
        res.redirect("/signin");
    })
}