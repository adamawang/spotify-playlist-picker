require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const request = require('request');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
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
app.get('/auth/spotify', passport.authenticate('spotify',  {
  // request scopes for spotify API access, access key granted will have these permissions
  scope: [
    'playlist-read-private',
    'user-library-read',
    'user-read-private',
    'user-read-email',
    'user-read-birthdate'
  ]
}), (req, res) => {
  // nothing happens here
});


app.get('/auth/spotify/callback', (req, res, next) => {
  passport.authenticate('spotify', (err, token, profile) => {
    if (err) {
      console.log('Error with spotify login');
    } else {
      // TODO don't save token and profile details here, create API call to retrieve user data from spotify
      // Save user info in the front
      res.redirect(`/#/key/${token}`);
    }
  })(req, res, next);
});

app.get('/api/playlist', (req, res) => {
  const authToken = req.headers.authorization;
  request({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: {
      authorization: authToken,
    }
  }, (err, response, body) => {
    if (err) {
      console.log('Spotify Playlist API error: ', err);
    }
    res.send(body);
  })
});

app.get('/api/savedtracks', (req, res) => {
  const authToken = req.headers.authorization;
  request({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/tracks?limit=50',
    headers: {
      authorization: authToken,
    }
  }, (err, response, body) => {
    if (err) {
      console.log('Spotify Tracks API error: ', err);
    }
    res.send(body);
  })
})

app.get('/api/userinfo', (req, res) => {
  const authToken = req.headers.authorization;
  request({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me',
    headers: {
      authorization: authToken,
    }
  }, (err, response, body) => {
    if (err) {
      console.log('Spotify Tracks API error: ', err);
    }
    res.send(body);
  })
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
