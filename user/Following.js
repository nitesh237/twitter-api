const mongoose = require('mongoose')

const FollowingSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Following', FollowingSchema)
