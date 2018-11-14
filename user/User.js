var mongoose = require("mongoose")
var Schema = new mongoose.Schema({
	name: String,
	username: String,
	password: String
})
mongoose.model('User', Schema)
module.exports = mongoose.model('User')