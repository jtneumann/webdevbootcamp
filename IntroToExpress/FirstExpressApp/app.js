var express = require("express");
var app = express();

// "/" => "Hi there!"
app.get("/", function(req, res){
   res.send("Hi there!"); 
});
// "/bye" => "Goodbye!"
app.get("/bye", function(req, res){
   res.send("Goodbye"); 
});
// "/dog" => "Bark!"
app.get("/dog", function(req, res) {
    res.send("Bark");
});

app.get("/r/:subredditName", function(req, res) {
    var subreddit = req.params.subredditName;
    res.send("Welcome to the " + subreddit.toUpperCase() + " Subreddit!");
})

app.get("/r/:subredditName/comments/:id/:title/", function(req, res) {
    res.send("The comments page");
})


//catch all route 
app.get("*", function(req, res) {
    res.send("Page Not Found");
})


// Tell Express to listen for requests (i.e., start server)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});