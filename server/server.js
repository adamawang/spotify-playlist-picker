require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
// pass the passport middleware
app.use(passport.initialize());

// serve static files
app.use(express.static(path.join(__dirname, '../src/')));
app.use(express.static(path.join(__dirname, '../src/client')));
app.use(express.static(path.join(__dirname, '../node_modules')));


// load passport strategies
const spotifyStrategy = require('./passport.js');

passport.use('spotify', spotifyStrategy);


// auth routes
app.get('/auth/spotify', passport.authenticate('spotify',  {scope: ['playlist-read-private'] }), (req, res) => {
  // nothing happens here
});


let authToken;
let currentProfile;

app.get('/auth/spotify/callback', (req, res, next) => {
  passport.authenticate('spotify', (err, token, profile) => {
    if (err) {
      console.log('Error with spotify login');
    } else {
      authToken = token;
      currentProfile = profile;
      res.redirect('/#/playlist');
    }
  })(req, res, next);
});

app.get('/api/playlist', (req, res) => {
  request({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      authorization: `Bearer ${authToken}`,
    }
  }, (err, response, body) => {
      if (err) {
        console.log('Spotify API error: ', err);
      }
      res.send(body);
    })
});

app.get('/api/userinfo', (req, res) => {
  res.send(currentProfile);
})


// set port
const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.log('Error with server: ', err);
  } else {
    console.log('Server listening on port: ', port);
  }
});
