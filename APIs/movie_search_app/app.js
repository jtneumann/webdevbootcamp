// General search: http://www.omdbapi.com/?s=guardians+of+the+galaxy&apikey=thewdb 

// Search with Movie ID: http://www.omdbapi.com/?i=tt3896198&apikey=thewdb 
    // &apikey=thewdb
// So everything is exactly the same as Colt explains in the following videos, 
// except you must append &apikey=thewdb to the end of your url.
var express = require("express");
var app = express();
var request = require("request");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
   res.render("search"); 
});


app.get("/results", (req, res) => {
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";
    request(url, (error, response, body) => {
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            // res.send(results["Search"][0]["Title"]);
            res.render("results", {data: data});
        }
    });
});




app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Movie app has started");
})