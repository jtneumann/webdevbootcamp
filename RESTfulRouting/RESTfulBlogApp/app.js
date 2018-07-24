var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();
// NEW ROUTE would not work until installed pathToRegexp?
// getting err: /home/ubuntu/workspace/RESTfulRouting/RESTfulBlogApp/node_modules/path-to-regexp/index.js:63
// continued: path = ('^' + path + (strict ? '' : path[path.length - 1] === '/' ? '?' : '/?'))
// var pathToRegexp = require('path-to-regexp');
//trying to solve problem with findById
// var router = express.Router({ mergeParams: true });

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public")); //to serve custom style sheet
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
// app.use(router);

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

//Creates a new blog when app is run
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1532140225690-f6d25ab4c891?ixlib=rb-0.3.5&s=dfb49858906f9d89f6fef4fb78cdafca&auto=format&fit=crop&w=1050&q=80",
//     body: "hello this is a blog post"
// });

//RESTful ROUTES
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

//INDEX ROUTE
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

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", (req, res) => {
    //sanitize blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log(err);
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        }
        else {
            res.render("show", { blog: foundBlog });
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//UPDATE Route
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE Route
app.delete("/blogs/:id", (req, res) => {
    //destroy blog
    Blog.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Serving Blog App");
});
