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


//these two lines needed when using passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Root route
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", (req, res) => {
    res.render("secret");
});





app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Serving the AuthDemo app")
});
