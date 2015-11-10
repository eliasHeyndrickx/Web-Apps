angular.module('hexChan', ['ui.router'])
.controller('homeController', ['$scope', function($scope){

  $scope.boards = [
    {title: "Tech Board", 
     description: "Board about technology.",
     img: '/img/boards/tech.jpg'},

    {title: "Anime Board", 
     description: "Board about anime.",
     img: '/img/boards/anime.jpg'},

    {title: "Games Board", 
     description: "Board about games.",
     img: '/img/boards/games.jpg'},

    {title: "Random Board",
     description: "Board about random stuff.",
     img: '/img/boards/random.jpg'}
  ];
    
}])
.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/public/index.html',
      views: {
      	'nav': {
      		templateUrl: '/public/templates/navMain.html'
      	},
        'cards':{
          templateUrl: '/public/templates/cards.html',
          controller: 'homeController'
        }
      }
    })
    .state('search', {
      url: '/search',
      templateUrl: '/public/index.html',
      controller: 'homeController',
      views: {
      	'nav': {
      		templateUrl: '/public/templates/navSearch.html'
      	},
        'cards':{
          templateUrl: '/public/templates/cards.html',
          controller: 'homeController'
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