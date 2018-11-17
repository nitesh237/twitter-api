var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
const Tweets = require('./Tweet')
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
  Tweets.findOne( {createdBy: req.user.username }, (err, tweet) => {
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
router.delete('/tweet', requireLogin, (req, res) => {

  	Tweets.deleteOne({
    	_id : req.params.id
  	}, err => {
    	if (err) {
        res.send({error: "error at server side"})
    	} else {
        res.send({message: "Deleted"})
    	}
  	})
})
module.exports = router