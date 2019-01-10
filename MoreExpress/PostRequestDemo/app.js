var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var friends = ["Tony", "Miranda", "Justin", "Pierre", "Lily"];

app.get("/", function(req, res){
    res.render("home");
});

app.post("/addfriend", function (req, res) {
    console.log(req.body);
    var newFriend = req.body.newfriend;
    friends.push(newFriend);
    res.redirect("/friends");
});

app.get("/friends", function(req, res){
    
    res.render("friends", {friends: friends}); // at 4:48 in lec 244
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started"); 
});