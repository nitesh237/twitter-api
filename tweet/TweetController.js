var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
const Tweets = require('./Tweet')
const Followings = require('../user/Followings')
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
* post route for '/tweet/new'
* using require login as middle wear
* Creates new entry in tweets schema
*/
router.post('/new', requireLogin, (req, res) => {

	//console.log(req.body)
	if(!req.body.text) {
		return res.status(400).json({message: "Missing Values"})
	}
  	Tweets.create(
    	{
      		createdBy: req.user.username,
      		text: req.body.text
    	},
    	(err, entry) => {
      		if (err) {
      			return res.status(500).json({error: "error at server side"})
      		} else {
      			return res.status(201).json({message: "Tweeted!"})
        	}
      		
    	}
  	)
})
/*
* get route for '/tweet/mytweets'
* using require login as middle wear
* returns an array of tweets objects of user logged in
*/
router.get('/mytweets', requireLogin, (req, res) => {
  Tweets.find( {createdBy: req.user.username }, (err, tweet) => {
    if (err) {
      return res.status(500).json({error: "error at server side"})
    } else if (tweet && tweet.length === 0){ 
      return res.status(400).json({message: "No Tweets to show"})
    } else {
      res.send(tweet)
    }
  })
})
/*
* get route for '/tweet/newsfeed'
* using require login as middle wear
* returns an array of tweets objects of followed users
*/
router.get('/newsfeed', requireLogin, async(req, res) => {

  var following = await Followings.find({from: req.user.username })
  if(following &&  following.length > 0) {
    var tweets_final = []
    for(i = 0; i < following.length; i++) {
      var tweets = await Tweets.find({createdBy: following[i].to})
      if(tweets && tweets.length >= 0) {
        tweets_final = tweets_final.concat(tweets)
      } else if(tweets) {
        return res.status(500).json({error: "error at server side1"})
      }
    }
    res.send(tweets_final)
  } else if(following && following.length === 0) {
    return res.status(400).json({message: "Not following anyone"})
  } else {
    return res.status(500).json({error: "error at server side"})
  }
})
/*
* delete route for '/tweet/'
* using require login as middle wear
* deletes entry from tweets schema created by current and having _id specified in req
*/
router.delete('/:id', requireLogin, (req, res) => {
  	Tweets.deleteOne({
    	_id : req.params.id,
      createdBy: req.user.username
  	}, err => {
    	if (err) {
        return res.status(500).json({error: "error at server side"})
    	} else {
        return res.status(200).json({message: "Deleted"})
    	}
  	})
})
module.exports = router