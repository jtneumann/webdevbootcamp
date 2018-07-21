var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

var campgrounds = [
    { name: "Salmon Creek", image: "https://photosforclass.com/download/pixabay-1892494?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db80d2cfd053ed1584d05fb1d4e97e07ee3d21cac104496f2c17ca4edb0be_960.jpg&user=12019" },
    { name: "Granit Hill", image: "https://photosforclass.com/download/flickr-7842069486" },
    { name: "Mountain Goat's Rest", image: "https://photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104496f2c178a5e4b3ba_960.jpg&user=Pexels" },
    { name: "Salmon Creek", image: "https://photosforclass.com/download/pixabay-1892494?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db80d2cfd053ed1584d05fb1d4e97e07ee3d21cac104496f2c17ca4edb0be_960.jpg&user=12019" },
    { name: "Granit Hill", image: "https://photosforclass.com/download/flickr-7842069486" },
    { name: "Mountain Goat's Rest", image: "https://photosforclass.com/download/pixabay-1851092?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104496f2c178a5e4b3ba_960.jpg&user=Pexels" }
]

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {

    res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image };
    campgrounds.push(newCampground);
    //redirect back to campgrounds page.
    res.redirect("/campgrounds"); //when redirecting, defaults to get request.
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});







app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Serving the YelpCamp");
});
