angular.module('spotify', [
  'ngRoute',
  'Playlist',
])

.config(($routeProvider) => {
  $routeProvider
  .when('/', {
    templateUrl: 'home.html',
  })
  .when('/playlist', {
    templateUrl: './playlist.html',
    controller: 'SearchController',
  })
  .when('/key/:key', {
    templateUrl: './key.html',
    controller: 'AuthController',
  })
  .otherwise({ redirectTo: '/' });
})
