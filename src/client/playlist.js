angular.module('Playlist', ['ngMaterial'])

.factory('Search', ($http) => {

  // for all api calls, include an 'authorization' header
  // with the word "Bearer" prepended to the key
  // Spotify auth requires it.

  const playlistSearch = (key) => {
    return $http({
      method: 'GET',
      url: '/api/playlist',
      headers: {
        authorization: `Bearer ${key}`,
      }
    })
    .then(response => response);
  }

  const songSearch = (key) => {
    return $http({
      method: 'GET',
      url: '/api/savedtracks',
      headers: {
        authorization: `Bearer ${key}`,
      }
    })
    .then(response => response);
  }

  const userInfo = (key) => {
    return $http({
      method: 'GET',
      url: '/api/userinfo',
      headers: {
        authorization: `Bearer ${key}`,
      }
    })
    .then(response => response);
  }

  return {
    playlistSearch,
    songSearch,
    userInfo,
  }
})

.controller('SearchController', function($scope, $location, $window, $sce, Search) {
  $scope.data = {};
  let playlists;        // save playlist data here
  let songs;            // save song data here
  let userData;         // save user data response here
  let userName;         // if display name is null, set username to id
  let userImage;        // if image array is empty, set to default image
  let playlistArt;      // if playlist images array is empty, set to default

  const defaultUserImage = "../image/icon_user.png"
  const defaultPlaylistImage = "../image/default_cover.png"

  // cases where user does not have playlists saved, or songs saved
  const noPLData = {
    name: "You don't have any saved playlists! Open Spotify and follow or like a playlist first."
  }
  const noSongData = {
    track: {
      name: "You don't have any saved songs!",
      artists: [
        {
          name: "Open Spotify and add some songs first."
        }
      ]
    }
  }

  $scope.showPlaylistButton = () => playlists === undefined;
  $scope.showSongsButton = () => songs === undefined;
  $scope.isLoggedIn = () => !!$window.localStorage.getItem('key');


  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);    // for angular to trust the url without yelling at us for XSS
  }

  $scope.findPlaylist = () => {
    const key = $window.localStorage.getItem('key');
    Search.playlistSearch(key)
    .then((response) => {
      console.log('plist response: ', response);
      playlists = response.data.items;

      // if user has no saved playlists, return default values
      if (playlists.length < 1) {
        $scope.data.playlist = noPLData;
        $scope.data.widget = `https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3xgbBiNc7mh3erYsCl8Fwg&theme=white`;
        $scope.data.playlist.images[0].url = "https://u.scdn.co/images/pl/default/109b80c1fa65b42ec86e6cf030be0f4cf24a6d46";
        return;
      }

      const randomNum = Math.floor(Math.random() * playlists.length);
      const randomPlaylist = playlists[randomNum];

      playlistArt = randomPlaylist.images.length ? randomPlaylist.images[0].url : defaultPlaylistImage;

      $scope.data.playlist = randomPlaylist;
      $scope.data.playlistArt = playlistArt;
      $scope.data.widget = `https://embed.spotify.com/?uri=${randomPlaylist.uri}&theme=white`;      // pass uri to widget
    })
  }

  $scope.findSong = () => {
    const key = $window.localStorage.getItem('key');
    Search.songSearch(key)
    .then((response) => {
      songs = response.data.items;

      // if user has no saved songs, return default values
      if (songs.length < 1) {
        $scope.data.songs = noSongData;
        return;
      }

      const randomNum = Math.floor(Math.random() * songs.length);
      const randomSong = songs[randomNum];

      $scope.data.songs = randomSong;
      $scope.data.songwidget = `https://embed.spotify.com/?uri=${randomSong.track.uri}&theme=white`;
    })
  }

  $scope.pickAnother = () => {
    const nextRandom = Math.floor(Math.random() * playlists.length);
    const nextRandomPlaylist = playlists[nextRandom];

    playlistArt = nextRandomPlaylist.images.length ? nextRandomPlaylist.images[0].url : defaultPlaylistImage;

    $scope.data.playlist = nextRandomPlaylist;
    $scope.data.playlistArt = playlistArt;
    $scope.data.widget = `https://embed.spotify.com/?uri=${nextRandomPlaylist.uri}&theme=white`;
  }

  $scope.pickAnotherSong = () => {
    const nextRandom = Math.floor(Math.random() * songs.length);
    const nextRandomSong = songs[nextRandom];

    $scope.data.songs = nextRandomSong;
    $scope.data.songwidget = `https://embed.spotify.com/?uri=${nextRandomSong.track.uri}&theme=white`;
  }

  $scope.showUserData = () => {
    const key = $window.localStorage.getItem('key');
    Search.userInfo(key)
    .then((response) => {
      userData = response.data

      userName = userData.display_name ? userData.display_name : userData.id;           // if display name is null, set username to id
      userImage = userData.images.length ? userData.images[0].url : defaultUserImage;   // if user images array is empty, set image to default

      $scope.data.user = userData;
      $scope.data.userName = userName;
      $scope.data.userImage = userImage;

      // simple auth check
      if(!userData){
        $location.path('/');
      }
    })
  }

  $scope.logOut = () => {
    $window.localStorage.removeItem('key');
    $location.path('/')
  }

  $scope.authCheck = () => {
    if(!$scope.isLoggedIn()){
      $location.path('/')
    }
  }

  $scope.authCheck();       // on controller load, run functions
  $scope.showUserData();
})

.controller('AuthController', function($scope, $location, $window) {
  $scope.setKey = () => {
    var key = $location.url().slice(5);
    $window.localStorage.setItem('key', key);
    $location.path('/playlist')
  }

  $scope.setKey();    // on controller load, save key that is encoded in URL into localStorage
})
