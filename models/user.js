var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose); //this allows the plm methods to be used on the UserSchema

module.exports = mongoose.model("User", UserSchema);
