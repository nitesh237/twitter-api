var mongoose = require('mongoose')
var TweetSchema = new mongoose.Schema({
  createdBy: String,
  text: String,
  createdAt : {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Tweet', TweetSchema)