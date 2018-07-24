var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo_2");

//POST - title, content
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});

var Post = mongoose.model("Post", postSchema);

//USER - email, name
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
});

var User = mongoose.model("User", userSchema);

// Post.create({
//     title: "wow! missing the .com on the email",
//     content: "bakjsdkjfl;dskjklsdjks"
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
User.findOne({ email: "bog@gmail.com" }).populate("posts").exec((err, user) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(user);
    }
});
