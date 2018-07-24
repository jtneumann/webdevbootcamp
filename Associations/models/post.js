var mongoose = require("mongoose");

//POST - title, content
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});


//return value for file
module.exports = mongoose.model("Post", postSchema); // var Post changed to module.exports
//for example can do this instead:
// var Post = mongoose.model("Post", postSchema);
// module.exports = Post;
