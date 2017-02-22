const SpotifyStrategy = require('passport-spotify').Strategy;


module.exports = new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/spotify/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, accessToken, profile);
  }
);


// callbackURL: 'https://spotify-playlist-picker.herokuapp.com/auth/spotify/callback',
// callbackURL: 'http://localhost:5000/auth/spotify/callback',
