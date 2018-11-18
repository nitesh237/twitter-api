var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
const Tweets = require('./Tweet')
const Followings = require('../user/Followings')
function requireLogin(req,res,next) {
	if(!req.user) {
		return res.status(401).json({message: "Login First!"})
	} else {
		console.log(`logged in as ${req.user.username}`)
		next()
	}
}
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
router.get('/newsfeed', requireLogin, async(req, res) => {

  var following = await Followings.find({from: req.user.username })
  if(following &&  following.length > 0) {
    //console.log("here")
    var tweets_final = []
    for(i = 0; i < following.length; i++) {
      //console.log(following[i].to)
      var tweets = await Tweets.find({createdBy: following[i].to})
      //console.log(tweets.length)
      if(tweets && tweets.length >= 0) {
        tweets_final = tweets_final.concat(tweets)
      } else if(tweets) {
        return res.status(500).json({error: "error at server side1"})
      }
    }
    //console.log(tweets_final)
    res.send(tweets_final)
  } else if(following && following.length === 0) {
    return res.status(400).json({message: "Not following anyone"})
  } else {
    return res.status(500).json({error: "error at server side"})
  }
})
router.delete('/:id', requireLogin, (req, res) => {
    //console.log(req.params)
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