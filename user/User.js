var mongoose = require("mongoose")
//var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String
})

module.exports = mongoose.model('User', UserSchema)