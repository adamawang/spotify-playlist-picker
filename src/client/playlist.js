angular.module('Playlist', [])

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

  $scope.showPlaylistButton = () => playlists === undefined;
  $scope.showSongsButton = () => songs === undefined;

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.findPlaylist = () => {
    const key = $window.localStorage.getItem('key');
    Search.playlistSearch(key)
    .then((response) => {
      playlists = response.data.items;
      const randomNum = Math.floor(Math.random() * playlists.length);
      $scope.data.playlist = playlists[randomNum];
      $scope.data.widget = `https://embed.spotify.com/?uri=${playlists[randomNum].uri}`;
    });
  };

  $scope.findSong = () => {
    const key = $window.localStorage.getItem('key');
    Search.songSearch(key)
    .then((response) => {
      songs = response.data.items;
      const randomNum = Math.floor(Math.random() * songs.length);
      $scope.data.songs = songs[randomNum];
      console.log('response from songs search: ', $scope.data.songs);
      $scope.data.songwidget = `https://embed.spotify.com/?uri=${songs[randomNum].track.uri}`;
    });
  };

  $scope.pickAnother = () => {
    const nextRandom = Math.floor(Math.random() * playlists.length);
    $scope.data.playlist = playlists[nextRandom];
    $scope.data.widget = `https://embed.spotify.com/?uri=${playlists[nextRandom].uri}`;
  };

  $scope.pickAnotherSong = () => {
    const nextRandom = Math.floor(Math.random() * songs.length);
    $scope.data.songs = songs[nextRandom];
    $scope.data.songwidget = `https://embed.spotify.com/?uri=${songs[nextRandom].track.uri}`;
  }

  $scope.showUserData = () => {
    const key = $window.localStorage.getItem('key');
    Search.userInfo(key)
    .then((response) => {
      userData = response.data
      $scope.data.user = userData;
      console.log('user data: ', userData)
      if(!userData){
        $location.path('/');
      }
    });
  };

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
