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

//INDEX - home page
app.get("/", (req, res) => {
    Campground.find({}).sort({ "_id": -1 }).limit(3).exec(function(err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("landing", { campgrounds: campgrounds });
        }
    });
});

//INDEX - Show all campgrounds
app.get("/campgrounds", (req, res) => {

    // Get all campgrounds from db
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: campgrounds }); //note: campgrounds obj --
            //now applies to the campgrounds obj2 in the .find cb function for Campground.find.
        }
    });

    // res.render("campgrounds", { campgrounds: campgrounds }); set up from array list
});



//CREATE - adds a new campground to DB
app.post("/campgrounds", (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc };
    //Create a new campground and save to DB; use same newCampground obj from line above
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds"); //same as when using array
        }
    });
    // campgrounds.push(newCampground);from array
    //redirect back to campgrounds page.
    //res.redirect("/campgrounds"); //when redirecting, defaults to get request.
});

//NEW - Show form to create a new campground
app.get("/campgrounds/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - show more info about one campground
app.get("/campgrounds/:id", isLoggedIn, (req, res) => {
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//===============
//COMMENTS ROUTES
//===============

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });

});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campround) => {
        if (err) {
            console.log(err);
        }
        else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    //connect new comment to campground
                    campround.comments.push(comment);
                    campround.save();
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campround._id);
                }
            });
        }
    });
});

//==============
// AUTH ROUTES
//==============
//show register form
app.get("/register", (req, res) => {
    res.render("register");
});
//handle sign up logic
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
    res.render("login");
});
//handle login
//format as app.post("/route", middleware, callback)
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

//logout route
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Serving the YelpCamp");
});
