require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
// pass the passport middleware
app.use(passport.initialize());

// serve static files
app.use(express.static(path.join(__dirname, '../src')));
app.use(express.static(path.join(__dirname, '../node_modules')));


// load passport strategies
const spotifyStrategy = require('./passport.js');

passport.use('spotify', spotifyStrategy);


// routes
app.get('/auth/spotify', passport.authenticate('spotify'), (req, res) => {
  // nothing
});

app.get('/auth/spotify/callback', (req, res, next) => {
  passport.authenticate('spotify', (err, info) => {
    if (err) {
      console.log('Error with spotify login');
    } else {
      console.log('we are good! passed auth');
      
    }
  })(req, res, next);
});

// set port
const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.log('Error with server: ', err);
  } else {
    console.log('Server listening on port: ', port);
  }
});
