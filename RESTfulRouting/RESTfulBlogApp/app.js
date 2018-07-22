var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public")); //to serve custom style sheet
app.use(bodyParser.urlencoded({ extended: true }));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now()
    }
});

var Blog = mongoose.model("Blog", blogSchema);

// Creates a new blog when app is run
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1532140225690-f6d25ab4c891?ixlib=rb-0.3.5&s=dfb49858906f9d89f6fef4fb78cdafca&auto=format&fit=crop&w=1050&q=80",
//     body: "hello this is a blog post"
// });

//RESTful ROUTES
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blogs: blogs });
        }
    });
});




app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Serving Blog App");
});
