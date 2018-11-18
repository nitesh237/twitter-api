var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
var User = require('./User')
var Followings = require('./Followings')
function requireLogin(req,res,next) {
	if(!req.user) {
		return res.send('Login First!')
	} else {
		console.log(`logged in as ${req.user.username}`)
		next()
	}
}

router.post('/follow', requireLogin, async(req, res) => {


	if(!req.body.username) {
		res.send({message: "Missing Values"})
	}
  	var from = req.user.username
  	var to = req.body.username
  	var user = await User.findOne({username: to})
  	if(user && user.username) {

  		var entry = await Followings.findOne(
  			{
  				from: from,
  				to: to
  			})
  		if(entry && entry.from) {
  			res.send({message: "Already Following"})
  		} else if(!entry) {
  			var entry1 = await Followings.create(
    			{
      				from: from,
      				to: to
    			})
  			if(entry1 && entry1.from) {
  				res.send({message: "Followed"})
  			} else {
  				res.send({error: "Error at server side"})
  			}
  		} else {
  			res.send({error: "Error at server side"})
  		}
  	} else if(user){
  		res.send({error: "Error at server side"})
  	} else {
  		res.send({message: "User doesn't Exists"})
  	}
})
router.post('/unfollow', requireLogin, (req, res) => {
	if(!req.body.username) {
		res.send({message: "Missing Values"})
	}
    var from = req.user.username
  	var to = req.body.username
  	Followings.deleteOne(
    {
      from: from,
      to: to,
    },
    (err, entry) => {
    	if (err) {
    		res.send({error: "Error at server side"})
    	} else {
    		res.send({message: "unfollowed"})
    	}
    }
  	)
})
router.get('/following', requireLogin, (req, res) => {
  Followings.find( {from: req.user.username }, (err, following) => {
    if (err) {
      res.send({error: "error at server side"})
    } else if (following && following.length === 0){ 
      res.send({message: "not following anyone"})
    } else {
      res.send(following)
    }
  })
})
router.get('/followers', requireLogin, (req, res) => {
  Followings.find( {to: req.user.username }, (err, followers) => {
    if (err) {
      res.send({error: "error at server side"})
    } else if (followers && followers.length === 0){ 
      res.send({message: "not following anyone"})
    } else {
      res.send(followers)
    }
  })
})
module.exports = router