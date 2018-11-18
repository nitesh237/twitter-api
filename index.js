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
mongoose.connect(config.dbURL, {useNewUrlParser: true})
passport.use(new LocalStrategy(
  (username, password, done) => {
    //console.log('Inside local strategy callback')
    User.findOne({ username: username }, (err, user) => {
    	if (err) { return done(err) }
    	if (!user) { return done(null, false) }
    	var passwordIsValid = bcrypt.compareSync(password, user.password)
    	if (!passwordIsValid) { return done(null, false) }
    	//console.log('Local strategy returned true')
    	return done(null, user)
    })
   }
))

passport.serializeUser((user, done) => {
  //console.log('Inside serializeUser callback. User username is save to the session file store here')
  done(null, user.username);
})

passport.deserializeUser((username, done) => {
  //console.log('Inside deserializeUser callback')
  //console.log(`The user name passport saved in the session file store is: ${username}`)
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
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {

	res.status(200).json({message: "welcome home"})
	
})
function requireLogin(req,res,next) {
	if(!req.user) {
		return res.send('Login First!')
	} else {
		console.log(`logged in as ${req.user.username}`)
		next()
	}
}

app.post('/register', async (req, res) => {
		
    console.log(req.body)
  	if(!req.body.username || !req.body.name || !req.body.password) {
  		return res.send({message: "Missing Values"})
  	}
   	
  	var user = await User.findOne({ username: req.body.username })
  	//console.log(user)
  	if(!user)
  	{
  		var hashedPassword = bcrypt.hashSync(req.body.password, 8)
  		var user2 = await User.create(
    	{
    	  	name : req.body.name,
    	    username : req.body.username,
    		password : hashedPassword
    	})
  		if(user2 && user2.username) {
  			res.send({message: "Registered Successfully"})
  		} else {
  			res.send({error: "Error at server side"})
  		}	
  	} else if(user.username){
  		res.send({message: "User Already Exists!"})
  	} else {
  		res.send({error: "Error at server side"})
  	}
})
app.post('/login', passport.authenticate('local'), (req, res) => {
    res.send("LOGGED IN")
})

app.get('/logout', requireLogin, (req, res) => {
	req.session.destroy((err) => {
		if(err) {
			res.send(err)
		} else {
			res.send("Logout SuccFull")
		}
	})
})

app.get("/api/status", (req, res) => {
	res.send('------SERVER RUNNING----')
})

const UserController = require(__root + 'user/UserController')
app.use('/api/user', UserController)

const TweetController = require(__root + 'tweet/TweetController')
app.use('/api/tweet', TweetController)

let port = config.port
app.listen(port, () => {
  console.log(`Starting on port ${port}`)
})

module.exports = app
