var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp_v6");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Anything we want",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate comes from passportLocalStategy in user.js file
passport.serializeUser(User.serializeUser()); //ibid
passport.deserializeUser(User.deserializeUser()); // ibid
//end passport config

//allows every page to check to see if you're logged in or not rather than using {
// currentUser: req.user } inside the render method.
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

//requiring routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Campground.create({
//     name: "Granit Hill",
//     image: "https://photosforclass.com/download/flickr-7842069486",
//     description: "This is a huge granite hill, no bathrooms or water, but beautiful"
// }, (err, campground) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("New Campground Created");
//         console.log(campground);
//     }
// });

var campgrounds = [
    { name: "Salmon Creek", image: "https://photosforclass.com/download/flickr-3062180144" },
    { name: "Arches Hill", image: "https://photosforclass.com/download/flickr-7842069486" },
    { name: "Mountain Goat's Rest", image: "https://photosforclass.com/download/flickr-5051605295" },
    { name: "Sunset Vertical", image: "https://photosforclass.com/download/flickr-1307278980" },
    { name: "Kirk Creek", image: "https://photosforclass.com/download/flickr-7842069486" },
    { name: "Mountain Goat's Rest", image: "https://photosforclass.com/download/flickr-3061337059" }
]


app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Serving the YelpCamp");
});
