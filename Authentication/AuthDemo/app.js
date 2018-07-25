var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();

app.set('view engine', 'ejs');
//what is the difference between express-session(s)
app.use(require("express-session")({
    secret: "not sure what this is",
    resave: false,
    saveUnintialized: false
}));
app.use(bodyParser.urlencoded({ extended: true })); //needed anytime using a form

//these two lines needed when using passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================
//ROUTES
//==================

// Root route
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret");
});

//AUTH ROUTES
//show sign up form
app.get("/register", (req, res) => {
    res.render("register");
});
//handling user sign up
app.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secret");
            });
        }
    });
});

//LOGIN ROUTES
//render login form
app.get("/login", (req, res) => {
    res.render("login");
});

//login logic           middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {});

//logout 
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Serving the AuthDemo app")
});
