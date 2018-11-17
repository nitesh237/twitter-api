const express = require("express"),
mongoose = require("mongoose"),
app =  express(),
config = require('./config'),
<<<<<<< HEAD
// session = require('express-session'),
// uuid = require('uuid/v4'),
//mongoStore = require('connect-mongo')(session),
//bodyParser = require('body-parser'),
//bcrypt = require('bcryptjs'),
// passport = require('passport'),
// LocalStrategy = require('passport-local').Strategy,
User = require('./user/User'),
Tweet = require('./tweet/Tweet')
=======
session = require('express-session'),
uuid = require('uuid/v4'),
mongoStore = require('connect-mongo')(session),
bodyParser = require('body-parser'),
bcrypt = require('bcryptjs'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
User = require('./user/User')
>>>>>>> parent of cab031d... Till - Extended


global.__root = __dirname + '/'

//mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
// passport.use(new LocalStrategy(
//   (username, password, done) => {
//     console.log('Inside local strategy callback')
//     User.findOne({ username: username }, (err, user) => {
//     	if (err) { return done(err) }
//     	if (!user) { return done(null, false) }
//     	var passwordIsValid = bcrypt.compareSync(password, user.password)
//     	if (!passwordIsValid) { return done(null, false) }
//     	console.log('Local strategy returned true')
//     	return done(null, user)
//     })
//    }
// ))

// passport.serializeUser((user, done) => {
//   console.log('Inside serializeUser callback. User username is save to the session file store here')
//   done(null, user.username);
// })

// passport.deserializeUser((username, done) => {
//   console.log('Inside deserializeUser callback')
//   console.log(`The user name passport saved in the session file store is: ${username}`)
//   User.findOne({username: username}, (err, user) => {
//   	if (err) { return done(err) }
//     	if (!user) { return done(null, false) }
//     	return done(null, user)
//   })
// })
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(session({
//   genid: (req) => {
//     console.log('Generating new session ID')
//     return uuid() 
//   },
//   store: new mongoStore({ mongooseConnection: mongoose.connection, autoRemove: 'interval', autoRemoveInterval: 120 }),
//   secret: 'supersecretkey',
//   resave: false,
//   saveUninitialized: true
// }))
// app.use(passport.initialize());
// app.use(passport.session());
app.get("/", (req, res) => {

	res.send(`Hello`)
	console.log("Inside call back")
	console.log(req.sessionID)
})
<<<<<<< HEAD
function requireLogin(req,res,next) {
	if(!req.user) {
		return res.send('Login First!')
	} else {
		console.log(`logged in as ${req.user.username}`)
		next()
	}
}

// app.post('/register', async (req, res) => {
		
//     console.log(req.body)
//   	if(!req.body.username || !req.body.name || !req.body.password) {
//   		return res.send({message: "Missing Values"})
//   	}
   	
//   	var user = await User.findOne({ username: req.body.username })
//   	//console.log(user)
//   	if(!user)
//   	{
//   		var hashedPassword = bcrypt.hashSync(req.body.password, 8)
//   		var user2 = await User.create(
//     	{
//     	  	name : req.body.name,
//     	    username : req.body.username,
//     		password : hashedPassword
//     	})
//   		if(user2 && user2.username) {
//   			res.send({message: "Registered Successfully"})
//   		} else {
//   			res.send({error: "Error at server side"})
//   		}	
//   	} else if(user.username){
//   		res.send({message: "User Already Exists!"})
//   	} else {
//   		res.send({error: "Error at server side"})
//   	}
// })
// app.post('/login', passport.authenticate('local'), (req, res) => {
//   	//console.log("Inside post Login Callback")
//   	//console.log(req.session.passport)
//   	//console.log(req.user)
//     res.send("LOGGED IN")
// })
// // app.get('/authrequired', (req, res) => {
// //   console.log('Inside GET /authrequired callback')
// //   console.log(`User authenticated? ${req.isAuthenticated()}`)
// //   if(req.isAuthenticated()) {
// //     res.send('you hit the authentication endpoint\n')
// //   } else {
// //     res.redirect('/')
// //   }
// // })
// //})
// app.get('/logout', requireLogin, (req, res) => {
// 	req.session.destroy((err) => {
// 		if(err) {
// 			res.send(err)
// 		} else {
// 			res.send("Logout SuccFull")
// 		}
// 	})
// })

app.post('/follow', requireLogin, async(req, res) => {


	if(!req.body.username) {
		res.send({message: "Missing Values"})
	}
  	var from = req.user.username
  	var to = req.body.username
  	var user = await User.findOne({username: to})
  	if(user && user.username) {

  		var entry = await Following.findOne(
  			{
  				from: from,
  				to: to
  			})
  		if(entry.from) {
  			res.send({message: "Already Following"})
  		} else if(!entry) {
  			var entry1 = await Following.create(
    			{
      				from: from,
      				to: to
    			})
  			if(entry1.from) {
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
app.post('/unfollow', requireLogin, (req, res) => {
	if(!req.body.username) {
		res.send({message: "Missing Values"})
	}
    var from = req.user.username
  	var to = req.body.username
  	Following.deleteOne(
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
app.post('/new', requireLogin, (req, res) => {

	//console.log(req.body)
	if(!req.body.content) {
		res.send({message: "Missing Values"})
	}
  	Tweet.create(
    	{
      		createdBy: req.user.username,
      		text: req.body.content
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
app.get('/read', requireLogin, (req, res) => {
  Tweet.find( {createdBy: req.user.username }, (err, tweet) => {
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
app.delete('/tweet', requireLogin, (req, res) => {

  	Tweet.deleteOne({
    	createdBy: req.user.username
  	}, err => {
    	if (err) {
      	
    	} else {
      	
    	}
  	})
=======
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
>>>>>>> parent of cab031d... Till - Extended
})
//})
app.get("/api/status", (req, res) => {
	res.send('------SERVER RUNNING----')
})


// const UserController = require(__root + 'user/UserController')
// app.use('/api/user', UserController)
var db = mongoose.connect("mongodb://localhost:27017/twitter-api-app", {useNewUrlParser: true})
let port = config.port
app.listen(3000, () => {
  console.log(`Starting on port ${3000}`)
})

//console.log(mongoose)
const AuthController = require(__root + 'auth/AuthController')
app.use('/api/auth', AuthController)
module.exports = app
