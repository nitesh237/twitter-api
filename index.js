const express = require("express"),
mongoose = require("mongoose"),
app =  express(),
config = require('./config').

global._root_ = __dirname + "/"

app.get("/", (req, res) => {
	res.send(`Hello`)
})

app.get("/api/status", (req, res) => {
	res.status(200).send('------SERVER RUNNING----')
})
const AuthController = require(__root + 'auth/AuthController')
app.use('/api/auth', AuthController)

mongoose.connect(config.dbURL, {useNewUrlParser: true})
let port = config.port
app.listen(port, () => {
  console.log(`Starting on port ${port}`)
})
module.exports = app
