angular.module('Playlist', [])

.factory('Search', ($http) => {

  const search = () => {
    return $http({
      method: 'GET',
      url: '/api/playlist'
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
    search,
    userInfo,
  }
})

.controller('SearchController', function($scope, Search) {
  $scope.data = {};
  let playlists;
  $scope.findPlaylist = () => {
    Search.search()
    .then((response) => {
      playlists = response.data.items;
      const randomNum = Math.floor(Math.random() * playlists.length);
      $scope.data.playlist = playlists[randomNum];
    })
  };
  $scope.pickAnother = () => {
    const nextRandom = Math.floor(Math.random() * playlists.length);
    console.log(playlists[nextRandom])
    $scope.data.playlist = playlists[nextRandom];
  }
  $scope.showUserData = () => {
    Search.userInfo()
    .then((response) => {
      const userData = response.data
      $scope.data.user = userData;
    })
  }

  $scope.showUserData();
})
