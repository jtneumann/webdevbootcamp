var express = require("express");
var app = express();

// "/" to print "Hi there, welcome to my assignment!"
app.get("/", function(req, res) {
    res.send("Hi there, welcome to my assignment");
});

app.get("/speak/:animal", function(req, res) {
    var sounds = {
        pig: "Oink",
        cow: "Moo",
        dog: "Woof"
    }
    var animal = req.params.animal.toLowerCase();
    var sound = sounds[animal];
    // if(animal === "pig"){
    //     sound = "Oink";
    // } else if (animal === "dog"){
    //     sound = "Woof";
    // } else if (animal === "")
    res.send("The " + animal + " says '" + sound + "'");
});

app.get("/repeat/:message/:times", function(req, res) {
    var message = req.params.message;
    var times = Number(req.params.times);
    var result = "";
    for(var i = 0; i < times; i++){
        result += message + "";
    }
    
    res.send(result);
});


app.get("*", function(req, res) {
    res.send("Sorry, page not found...what are you doing here");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has started");
});