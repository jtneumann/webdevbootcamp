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
router.get("/register", (req, res) => {
    res.render("register");
});
//handle sign up logic
router.post("/register", (req, res) => {
    var newUser = (new User({ username: req.body.username }));
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });

});

//show login form
router.get("/login", (req, res) => {
    res.render("login");
});
//handle login
//format as router.post("/route", middleware, callback)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;
