angular.module('Playlist', [])

.factory('Search', ($http) => {

  const playlistSearch = () => {
    return $http({
      method: 'GET',
      url: '/api/playlist'
    })
    .then(response => response);
  }

  const songSearch = () => {
    return $http({
      method: 'GET',
      url: '/api/savedtracks'
    })
    .then(response => response);
  }

  const userInfo = () => {
    return $http({
      method: 'GET',
      url: '/api/userinfo'
    })
    .then(response => response);
  }

  return {
    playlistSearch,
    songSearch,
    userInfo,
  }
})

.controller('SearchController', function($scope, $location, Search) {
  $scope.data = {};
  // save playlist data here
  let playlists;
  let songs;
  let userData;

  $scope.showPlaylistButton = () => playlists === undefined;
  $scope.showSongsButton = () => songs === undefined;

  $scope.findPlaylist = () => {
    Search.playlistSearch()
    .then((response) => {
      playlists = response.data.items;
      const randomNum = Math.floor(Math.random() * playlists.length);
      $scope.data.playlist = playlists[randomNum];
    });
  };

  $scope.findSong = () => {
    Search.songSearch()
    .then((response) => {
      songs = response.data.items;
      const randomNum = Math.floor(Math.random() * songs.length);
      $scope.data.songs = songs[randomNum];
    });
  };

  $scope.pickAnother = () => {
    const nextRandom = Math.floor(Math.random() * playlists.length);
    $scope.data.playlist = playlists[nextRandom];
  };

  $scope.pickAnotherSong = () => {
    const nextRandom = Math.floor(Math.random() * songs.length);
    $scope.data.songs = songs[nextRandom];
  }

  $scope.showUserData = () => {
    Search.userInfo()
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
