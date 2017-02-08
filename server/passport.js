const SpotifyStrategy = require('passport-spotify').Strategy;


module.exports = new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://adamwang.me/auth/spotify/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, accessToken, profile);
  }
);
