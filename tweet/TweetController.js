var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
const Tweets = require('./Tweet')
const Followings = require('../user/Followings')
function requireLogin(req,res,next) {
	if(!req.user) {
		return res.send('Login First!')
	} else {
		console.log(`logged in as ${req.user.username}`)
		next()
	}
}
router.post('/new', requireLogin, (req, res) => {

	//console.log(req.body)
	if(!req.body.text) {
		res.send({message: "Missing Values"})
	}
  	Tweets.create(
    	{
      		createdBy: req.user.username,
      		text: req.body.text
    	},
    	(err, entry) => {
      		if (err) {
      			res.send({error: "error at server side"})
      		} else {
      			res.send({message: "Tweeted!"})
        	}
      		
    	}
  	)
})
router.get('/mytweets', requireLogin, (req, res) => {
  Tweets.find( {createdBy: req.user.username }, (err, tweet) => {
    if (err || !tweet) {
    	res.send({message: "no tweets to display"})
    } else {
      // return res.status(404).json({
      //   error: 'Failed to find tweet'
      // })
      console.log(tweet)
    	res.send(tweet)
	}
  })
})
router.get('/newsfeed', requireLogin, async(req, res) => {

  var following = await Followings.find({from: req.user.username })
  if(following &&  following.length > 0) {
    console.log("here")
    var tweets_final = []
    for(i = 0; i < following.length; i++) {
      //console.log(following[i].to)
      var tweets = await Tweets.find({createdBy: following[i].to})
      //console.log(tweets.length)
      if(tweets && tweets.length >= 0) {
        tweets_final = tweets_final.concat(tweets)
      } else if(tweets) {
        res.send({error: "error at server side1"})
      }
    }
    //console.log(tweets_final)
    res.send(tweets_final)
  } else if(following && following.length === 0) {
    res.send({message: "Not following anyone"})
  } else {
    res.send({error: "error at server side"})
  }
})
router.delete('/:id', requireLogin, (req, res) => {
    //console.log(req.params)
  	Tweets.deleteOne({
    	_id : req.params.id,
      createdBy: req.user.username
  	}, err => {
    	if (err) {
        res.send({error: "error at server side"})
    	} else {
        res.send({message: "Deleted"})
    	}
  	})
})
module.exports = router