angular.module('Playlist', ['ngMaterial'])

.factory('Search', ($http) => {

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
  // save playlist data here
  let playlists;
  let songs;
  let userData;
  const noPLData = {
    name: "You don't have any saved playlists! Open Spotify and follow or like a playlist first."
  }
  const noSongData = {
    track: {
      name: "You don't have any saved songs!",
      artists: [
        0: {
          name: "Open Spotify and add some songs first."
        }
      ]
    }
  }

  $scope.showPlaylistButton = () => playlists === undefined;
  $scope.showSongsButton = () => songs === undefined;
  $scope.isLoggedIn = () => !!$window.localStorage.getItem('key');

  $scope.trustSrc = function(src) {
    // for angular to trust the url without yelling at us for XSS
    return $sce.trustAsResourceUrl(src);
  }

  $scope.findPlaylist = () => {
    const key = $window.localStorage.getItem('key');
    Search.playlistSearch(key)
    .then((response) => {
      playlists = response.data.items;
      if (playlists.length < 1) {
        $scope.data.playlist = noPLData;
        return;
      }
      const randomNum = Math.floor(Math.random() * playlists.length);
      $scope.data.playlist = playlists[randomNum];
      $scope.data.widget = `https://embed.spotify.com/?uri=${playlists[randomNum].uri}&theme=white`;
    })
  }

  $scope.findSong = () => {
    const key = $window.localStorage.getItem('key');
    Search.songSearch(key)
    .then((response) => {
      songs = response.data.items;
      if (songs.length < 1) {
        $scope.data.songs = noSongData;
        return;
      }
      const randomNum = Math.floor(Math.random() * songs.length);
      $scope.data.songs = songs[randomNum];
      console.log(songs[randomNum]);

      $scope.data.songwidget = `https://embed.spotify.com/?uri=${songs[randomNum].track.uri}&theme=white`;
    })
  }

  $scope.pickAnother = () => {
    const nextRandom = Math.floor(Math.random() * playlists.length);
    $scope.data.playlist = playlists[nextRandom];
    $scope.data.widget = `https://embed.spotify.com/?uri=${playlists[nextRandom].uri}&theme=white`;
  }

  $scope.pickAnotherSong = () => {
    const nextRandom = Math.floor(Math.random() * songs.length);
    $scope.data.songs = songs[nextRandom];
    $scope.data.songwidget = `https://embed.spotify.com/?uri=${songs[nextRandom].track.uri}&theme=white`;
  }

  $scope.showUserData = () => {
    const key = $window.localStorage.getItem('key');
    Search.userInfo(key)
    .then((response) => {
      userData = response.data
      $scope.data.user = userData;
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

  $scope.authCheck();
  $scope.showUserData();
})

.controller('AuthController', function($scope, $location, $window) {
  $scope.setKey = () => {
    var key = $location.url().slice(5);
    $window.localStorage.setItem('key', key);
    $location.path('/playlist')
  }
  $scope.setKey();
})
