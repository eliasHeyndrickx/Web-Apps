angular.module('hexChan', ['ui.router', 'templates', 'boards', 'threads'])
.controller('navController', ['$scope', '$stateParams', 'boards',
  function($scope, $stateParams, boards){
  
  // Set Page Title

  // We are on the catalog.
  if ($stateParams.hasOwnProperty('boardId')){
    // Get board information
    boards.getBoard($stateParams.boardId, function(response){
      $scope.pageTitle = response.data[0].title;
    });

  }else{
  // We are on the home page
    $scope.pageTitle = "0xF Chan"; 
  }

}])
.controller('overviewController', 
    ['$scope', 'boards', function($scope, boards){
    
    boards.getBoards(function(response){
      $scope.boards = response.data;
    });

}])
.controller('catalogController', ['$scope', '$stateParams', 'threads', 
  function($scope, $stateParams, threads){

  threads.getThreads($stateParams.boardId, function(response){
    $scope.threads = response.data;
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
      		templateUrl: 'navMain.html',
          controller: 'navController'
      	},
        'content':{
          templateUrl: 'board.html',
          controller: 'overviewController'
        }
      }
    })
    .state('board', {
      url: '/home/board/:boardId',
      templateUrl: 'index.html',
      views: {
        'nav': {
          templateUrl: 'navMain.html',
          controller: 'navController'
        },
        'content':{
          templateUrl: 'boardCatalog.html',
          controller: 'catalogController'
        }
      }
    })
    .state('search', {
      url: '/search',
      templateUrl: 'index.html',
      views: {
      	'nav': {
      		templateUrl: 'navSearch.html'
      	},
        'content':{
          templateUrl: 'board.html',
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