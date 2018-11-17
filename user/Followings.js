const mongoose = require('mongoose')

const FollowingsSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
})
mongoose.model('Followings', FollowingsSchema)

module.exports = mongoose.model('Followings')
