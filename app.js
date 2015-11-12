angular.module('hexChan', ['ui.router', 'templates', 'boards'])
.controller('homeController', ['$scope', '$stateParams', 
  function($scope, $stateParams){
    
}])
.controller('overviewController', 
    ['$scope', 'boards', function($scope, boards){
    
    boards.getBoards(function(response){
      $scope.boards = response.data;
      console.log(response);
    });

}])
.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state('overview', {
      url: '/home/overview',
      templateUrl: 'index.html',
      views: {
      	'nav': {
      		templateUrl: 'navMain.html'
      	},
        'content':{
          templateUrl: 'cards.html',
          controller: 'overviewController'
        }
      }
    })
    .state('search', {
      url: '/search',
      templateUrl: 'index.html',
      controller: 'homeController',
      views: {
      	'nav': {
      		templateUrl: 'navSearch.html'
      	},
        'content':{
          templateUrl: 'cards.html',
          controller: 'searchController'
        }
      }
    })
	
	$urlRouterProvider.otherwise('/home/overview');

    //.state('posts', {
    //	url: '/posts/{id}',
    //	templateUrl: 'templates/posts.html',
    //	controller: 'commentController'
    //});
   
}]);