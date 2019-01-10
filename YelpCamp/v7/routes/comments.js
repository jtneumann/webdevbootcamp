var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//comments new form
router.get("/new", isLoggedIn, (req, res) => {
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

//comments create from form
router.post("/", isLoggedIn, (req, res) => {
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
// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
