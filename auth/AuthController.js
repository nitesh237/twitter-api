var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var session = require('express-session')
var User = require('../user/User')
var config = require('../config')
var bcrypt = require('bcryptjs')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(session{config.secret})


//var jwt = require('jsonwebtoken')



var sess
router.post('/register', (req, res) => {

  //console.log(req.body)
  if (!req.body.name || !req.body.username || !req.body.password) {
    res.status(400).json({
      error: 'Missing values.'
    })
    return
  }

  var hashedPassword = bcrypt.hashSync(req.body.password, 8)
  User.findOne({ username: req.body.username }, (err, user) => {
    if(err) {
    	res.status(500).send("There was a problem registering the user.")
    	return
    } 
    if(user) {
    	res.status(500).send("Username Already Exists.")
    	return
    }
  })
  User.create(
    {
      name : req.body.name,
      username : req.body.username,
      password : hashedPassword
    },
    (err, user) => {
      if (err) {
      	res.status(500).send("There was a problem registering the user.")
      	return
      }

   
      // var token = jwt.sign({ id: user._id }, config.secret, {
      //   expiresIn: 86400 
      // })

      res.status(200).send("User-" + req.body.username + " registered successfully! Now try logging in.")
    })
})

router.post('/login', (req, res) => {
  
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return res.status(500).send('Error on the server.')
    if (!user) return res.status(404).send('No user found.')

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) return res.status(401).send("Invalid Password")

   
    // var token = jwt.sign({ id: user._id }, config.secret, {
    //   expiresIn: 86400 // expires in 24 hours
    // })
    sess = req.session
    sess.username = req.body.username
    res.status(200).send("Login successful")
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
  	if(err) {
    	res.status(500).send('Error on the server.')
  	}
  })
  res.status(200).send('Logged Out!')
})
