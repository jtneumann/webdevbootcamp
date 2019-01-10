var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
// var User = require("./models/user");
var seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp_v4");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

seedDB();


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
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - show more info about one campground
app.get("/campgrounds/:id", (req, res) => {
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

app.get("/campgrounds/:id/comments/new", (req, res) => {
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

app.post("/campgrounds/:id/comments", (req, res) => {
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



app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Serving the YelpCamp");
});
