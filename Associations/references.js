var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo_2");

var Post = require("./models/post");
var User = require("./models/user");



Post.create({
    title: "testing for the module.exports section",
    content: "bakjsdkjfl;dskjklsdjks"
}, function(err, post) {
    User.findOne({ email: "bog@gmail.com" }, function(err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            foundUser.posts.push(post);
            foundUser.save(function(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(data);
                }
            });
        }
    });
});

// Post.create({
//     title: "How to cook the best burger pt. 4",
//     content: "AKLSJDLAKSJD"
// }, function(err, post) {
//     User.findOne({ email: "bog@gmail.com" }, function(err, foundUser) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             foundUser.posts.push(post);
//             foundUser.save(function(err, data) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                     console.log(data);
//                 }
//             });
//         }
//     });
// });

// User.create({
//     email: "bog@gmail.com",
//     name: "Bob Belcher"
// });

//find user
//find all posts for that user
// User.findOne({ email: "bog@gmail.com" }).populate("posts").exec((err, user) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log(user);
//     }
// });
