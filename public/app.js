angular.module('hexChan', ['ui.router'])
.controller('homeController', ['$scope', function($scope){

}])
.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'homeController',
      views: {
      	'nav': {
      		templateUrl: '/public/templates/navMain.html'
      	}
      }
    })
    .state('search', {
      url: '/search',
      controller: 'homeController',
      views: {
      	'nav': {
      		templateUrl: '/public/templates/navSearch.html'
      	}
      }
    })
	
	$urlRouterProvider.otherwise('/home');

    //.state('posts', {
    //	url: '/posts/{id}',
    //	templateUrl: 'templates/posts.html',
    //	controller: 'commentController'
    //});
   
}]);