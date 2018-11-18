/**
 * This is the main file
 */

const express = require("express"),
mongoose = require("mongoose"),
app =  express(),
config = require('./config'),
session = require('express-session'),
uuid = require('uuid/v4'),
mongoStore = require('connect-mongo')(session),
bodyParser = require('body-parser'),
bcrypt = require('bcryptjs'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
User = require('./user/User')



global.__root = __dirname + '/'
mongoose.connect(config.dbURL, {useNewUrlParser: true}) //creates a connection to mongodb at dbURL specified in config js
/*
*   Defines a local strategy based on which users are authenticated
*/
passport.use(new LocalStrategy(
  (username, password, done) => {
    
    User.findOne({ username: username }, (err, user) => {
    	if (err) { return done(err) }
    	if (!user) { return done(null, false) }
    	var passwordIsValid = bcrypt.compareSync(password, user.password) //compares the hashed passwords
    	if (!passwordIsValid) { return done(null, false) }
    	
    	return done(null, user)
    })
   }
))

/*
*   SerializeUser specify what to write in cookie file 
*/
passport.serializeUser((user, done) => {
  done(null, user.username);
})
/*
*   DeserializeUser specify how to the user info from the cookie file.
*/
passport.deserializeUser((username, done) => {

  User.findOne({username: username}, (err, user) => {
  	if (err) { return done(err) }
    	if (!user) { return done(null, false) }
    	return done(null, user)
  })
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/*
* Sessions middle wear config.
* To be used by passport
*/
app.use(session({
  genid: (req) => {
    console.log('Generating new session ID')
    return uuid() //generates unique id for each session
  },
  store: new mongoStore({ mongooseConnection: mongoose.connection, autoRemove: 'interval', autoRemoveInterval: 120 }), //stores session in mongodb
  secret: config.secret, //secret key to sign sessions
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
/*
* Get route for '/'
*/
app.get("/", (req, res) => {

	res.status(200).json({message: "welcome home"})
	
})
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
* Posr route for '/register'
* creates an entry in the users schema if there is no user with same user name
*/
app.post('/register', async (req, res) => {
		
    
  	if(!req.body.username || !req.body.name || !req.body.password) {
  		 return res.status(400).json({message: "Missing Values"})
  	}
   	
  	var user = await User.findOne({ username: req.body.username })
  	
  	if(!user)
  	{
  		var hashedPassword = bcrypt.hashSync(req.body.password, 8) //hashes the password before storing it to database
  		var user2 = await User.create(
    	{
    	  	name : req.body.name,
    	    username : req.body.username,
    		password : hashedPassword
    	})
  		if(user2 && user2.username) {
  			return res.status(201).json({message: "Registered Successfully"})
  		} else {
  			return res.status(500).json({error: "Error at server side"})
  		}	
  	} else if(user.username){
  		 return res.status(409).json({message: "User Already Exists!"})
  	} else {
  		return res.status(500).json({error: "Error at server side"})
  	}
})
/*
* post route for '/login' using
* passport.authenticate() as middle wear to authenticate
* returns a cookie file containing all the user info for further access of other functionality
*/
app.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({message: "LOGGED IN"})
})
/*
* get route for '/logout' 
* uses requireLogin as a middle wear
* destroys the session for the current user as well as cookie 
*/
app.get('/logout', requireLogin, (req, res) => {
	req.session.destroy((err) => {
		if(err) {
			res.status(500).json({error: "Error at server side"})
		} else {
			res.status(200).json({message: "Logout SuccFull"})
		}
	})
})

app.get("/status", (req, res) => {
	res.send('------SERVER RUNNING----')
})

const UserController = require(__root + 'user/UserController') //includes the file UserController.js at the end point /user
app.use('/user', UserController)

const TweetController = require(__root + 'tweet/TweetController')  //includes the file TweetController.js at the end point /tweet
app.use('/tweet', TweetController)

let port = config.port
app.listen(port, () => {
  console.log(`Starting on port ${port}`)
})

module.exports = app
