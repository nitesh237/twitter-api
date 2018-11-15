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
mongoose.connect("mongodb://localhost:27017/twitter-api-app", {useNewUrlParser: true})
//mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('Inside local strategy callback')
    User.findOne({ username: username }, (err, user) => {
    	if (err) { return done(err) }
    	if (!user) { return done(null, false) }
    	var passwordIsValid = bcrypt.compareSync(password, user.password)
    	if (!passwordIsValid) { return done(null, false) }
    	console.log('Local strategy returned true')
    	return done(null, user)
    })
   }
))

passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User username is save to the session file store here')
  done(null, user.username);
})

passport.deserializeUser((username, done) => {
  console.log('Inside deserializeUser callback')
  console.log(`The user name passport saved in the session file store is: ${username}`)
  User.findOne({username: username}, (err, user) => {
  	if (err) { return done(err) }
    	if (!user) { return done(null, false) }
    	return done(null, user)
  })
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    console.log('Generating new session ID')
    return uuid() 
  },
  store: new mongoStore({ mongooseConnection: mongoose.connection, autoRemove: 'interval', autoRemoveInterval: 120 }),
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {

	res.send(`Hello`)
	console.log("Inside call back")
	console.log(req.sessionID)
})
app.get('/', (req, res) => {
  console.log(req.sessionID)
  res.send(`You got home page!\n`)
})
app.post('/register', (req, res) => {
		
  
    //res.send("Missing Values")
    //console.log(req.body)
  	console.log("here")
  	var msg = ""
   	var hashedPassword = bcrypt.hashSync(req.body.password, 8)
  	User.findOne({ username: req.body.username }, (err, user) => {
    	if(err) {
    		msg +="There was a problem registering the user."
    	} 
    if(user) {
    	msg += "Username Already Exists."
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
      	msg += "There was a problem registering the user."
      	
      }
      msg += "registered successfullly now try logging in."
    })
   	res.send(msg)
})
app.post('/login', passport.authenticate('local'), (req, res) => {
  	console.log("Inside post Login Callback")
  	console.log(req.session.passport)
  	console.log(req.user)
    res.send("LOGGED IN")
})
app.get('/authrequired', (req, res) => {
  console.log('Inside GET /authrequired callback')
  console.log(`User authenticated? ${req.isAuthenticated()}`)
  if(req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    res.redirect('/')
  }
})
//})
app.get("/api/status", (req, res) => {
	res.send('------SERVER RUNNING----')
})
// const AuthController = require(__root + 'auth/AuthController')
// app.use('/api/auth', AuthController)

// const UserController = require(__root + 'user/UserController')
// app.use('/api/user', UserController)

let port = config.port
app.listen(3000, () => {
  console.log(`Starting on port ${3000}`)
})

module.exports = app
