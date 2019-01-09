var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var passport = require("passport");
var User = require("../models/user");

//INDEX - root route
router.get("/", (req, res) => {
    Campground.find({}).sort({ "_id": -1 }).limit(3).exec(function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("landing", { campgrounds: campgrounds });
        }
    });
});

//==============
// AUTH ROUTES
//==============
//show register form
// router.get("/register", (req, res) => {
//     res.render("register");
// });


// show register form
router.get("/register", function(req, res) {
    res.render("register", { page: 'register' });
});


//handle sign up logic
router.post("/register", (req, res) => {
    var newUser = (new User({ username: req.body.username }));
    //eval(require('locus'));
    if (req.body.adminCode === 's5cReTc0de!') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "You have successfully signed up! Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });

});

//show login form
// router.get("/login", (req, res) => {
//     res.render("login");
// });

//show login form
router.get("/login", function(req, res) {
    res.render("login", { page: 'login' });
});

//handle login
//format as router.post("/route", middleware, callback)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "Welcome Back!",
    failureFlash: true //adds flash err message to login page
}), (req, res) => {});

//logout route
// router.get("/logout", function(req, res) {
//     req.logout();
//     req.flash("success", "Logged you out!");
//     res.redirect("/campgrounds");
// });

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have been successfully logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;
