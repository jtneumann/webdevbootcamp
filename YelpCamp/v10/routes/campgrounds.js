var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");


//INDEX - Show all campgrounds
router.get("/", isLoggedIn, (req, res) => {

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
router.post("/", isLoggedIn, (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author };
    console.log(req.user);
    //Create a new campground and save to DB; use same newCampground obj from line above
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated);
            res.redirect("/campgrounds"); //same as when using array
        }
    });
    // campgrounds.push(newCampground);from array
    //redirect back to campgrounds page.
    //res.redirect("/campgrounds"); //when redirecting, defaults to get request.
});

//NEW - Show form to create a new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - show more info about one campground
router.get("/:id", isLoggedIn, (req, res) => {
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, (req, res) => {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            res.redirect("campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect somewhere(usually the show page)
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect("back");
            }
            else {
                //if so does user own the campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    //once up check the route below for "campgrounds/edit" Answer: this for views folder
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("back");
    }

}

module.exports = router;
