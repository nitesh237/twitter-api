var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var session = require('express-session')
var User = require('../user/User')
var config = require('../config')
var bcrypt = require('bcryptjs')
var passport = require('passport')
var session = require('express-session')
var uuid = require('uuid/v4')
var mongoStore = require('connect-mongo')(session)
var LocalStrategy = require('passport-local').Strategy
var app = require('../index')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
console.log(app)
// router.use(session({
//   genid: (req) => {
//     console.log('Generating new session ID')
//     return uuid() 
//   },
//   store: new mongoStore({ mongooseConnection: , autoRemove: 'interval', autoRemoveInterval: 120 }),
//   secret: 'supersecretkey',
//   resave: false,
//   saveUninitialized: true
// }))

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

router.use(passport.initialize());
router.use(passport.session());

function requireLogin(req,res,next) {
  if(!req.user) {
    return res.send('Login First!')
  } else {
    console.log(`logged in as ${req.user.username}`)
    next()
  }
}

router.post('/register', async (req, res) => {
    
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
router.post('/login', passport.authenticate('local'), (req, res) => {
    //console.log("Inside post Login Callback")
    //console.log(req.session.passport)
    //console.log(req.user)
    res.send("LOGGED IN")
})

router.get('/logout', requireLogin, (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      res.send(err)
    } else {
      res.send("Logout SuccFull")
    }
  })
})

module.exports = router
