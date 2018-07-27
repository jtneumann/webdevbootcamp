var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var passport = require("passport");
var User = require("../models/user");

//INDEX - home page
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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
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
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
})

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;
