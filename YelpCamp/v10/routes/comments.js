var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new form
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
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
                    // console.log(req.user.username);
                    // console.log(comment)
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
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

//EDIT comments ROUTE

// router.get("/:comment_id/edit", (req, res) => {

// });

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    console.log(req.params.comment_id);
    Comment.findById(req.params.comment_id, (err, foundComment) => {

        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });

});

// COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id); //show page for campground which is why we request the id and not req.params.comment_id
        }
    });
});
//DESTROY comments ROUTE
router.delete("/:comment_id", (req, res) => {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;
