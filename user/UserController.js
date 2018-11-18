var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
var User = require('./User')
var Followings = require('./Followings')
/*
* Middle Wear to check whether the user is logged in and authenticated
*/
function requireLogin(req,res,next) {
  if(!req.user) { //req.user contains the information of current user incase authenticated.
    return res.status(401).json({message: "Login First!"})
  } else {
    console.log(`logged in as ${req.user.username}`)
    next()
  }
}
/*
* Post route '/user/follow' 
* using require login as middle wear
* creates an entry in the table following if the user is not followed earlier
*/
router.post('/follow', requireLogin, async(req, res) => {


	if(!req.body.username) {
		return res.status(400).json({message: "Missing Values"})
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
  			return res.status(409).json({message: "Already Following"})
  		} else if(!entry) {
  			var entry1 = await Followings.create(
    			{
      				from: from,
      				to: to
    			})
  			if(entry1 && entry1.from) {
  				return res.status(201).json({message: "Followed"})
  			} else {
  				return res.status(500).json({error: "Error at server side"})
  			}
  		} else {
  			return res.status(500).json({error: "Error at server side"})
  		}
  	} else if(user){ 
  		return res.status(500).json({error: "Error at server side"})
  	} else {
  		return res.status(400).json({message: "User doesn't Exists"})
  	}
})
/*
* Post route '/user/unfollow' 
* using require login as middle wear
* deletes an entry in the table following 
*/
router.post('/unfollow', requireLogin, (req, res) => {
	if(!req.body.username) {
		return res.status(400).json({message: "Missing Values"})
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
    		return res.status(500).json({error: "Error at server side"})
    	} else {
    		return res.status(200).json({message: "unfollowed"})
    	}
    }
  	)
})
/*
* Post route '/user/following' 
* using require login as middle wear
* returns an array of entry from followings, where from: has value equal to current user
*/
router.get('/following', requireLogin, (req, res) => {
  Followings.find( {from: req.user.username }, (err, following) => {
    if (err) {
      return res.status(500).json({error: "error at server side"})
    } else if (following && following.length === 0){ 
      return res.status(400).json({message: "not following anyone"})
    } else {
      res.send(following)
    }
  })
})
/*
* Post route '/user/followers' 
* using require login as middle wear
* returns an array of entry from followings, where to: has value equal to current user
*/
router.get('/followers', requireLogin, (req, res) => {
  Followings.find( {to: req.user.username }, (err, followers) => {
    if (err) {
      return res.status(500).json({error: "error at server side"})
    } else if (followers && followers.length === 0){ 
      return res.status(400).json({message: "not following anyone"})
    } else {
      res.send(followers)
    }
  })
})
module.exports = router