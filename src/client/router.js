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
  .otherwise({ redirectTo: '/' });
})
