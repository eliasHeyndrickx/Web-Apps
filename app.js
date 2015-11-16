var app = angular.module('hexChan', ['ui.router', 'templates'])
.constant("sitename", "0xF Chan")
.controller('navMainController', 
  ['$scope', '$stateParams', 'sitename', 'boards', 'cards',
  function($scope, $stateParams, sitename, boards, cards){
  
  // In a specific bord
  if ($stateParams.boardId){
    
    // Get board information
    boards.getBoard($stateParams.boardId, function(response){
      $scope.pageTitle = response.title;
    });

    $scope.boardId = $stateParams.boardId;

  }else{

  // We are on the home page
    $scope.pageTitle = sitename;
  }

}])
.controller('navSearchController', 
  ['$scope', '$stateParams', 'boards', 'cards', 'sitename',
   function($scope, $stateParams, boards, cards, sitename){
  
  // Update Cards
  $scope.searchByTitle = function($event){
    var searchValue = document.getElementById("search").value;
    var regExp = new RegExp(searchValue, "i");
    cards.setFilter(regExp);
  };

  // Last board
  if(!$stateParams.boardId){

    // Home page
    $scope.lastBoard = "board";

    // Set page title
    $scope.pageTitle = sitename;
  }else{
    $scope.lastBoard = "board/" + $stateParams.boardId;

    // Set page title
    boards.getBoard($stateParams.boardId, function(response){
      $scope.pageTitle = response.title;
    });
  }

}])
.controller('searchThreadController', 
    ['$scope', '$stateParams', 'threads', 'cards', 
    function($scope, $stateParams, threads, cards){

    // Are the cards valid?
    if(cards.isValid()){
      bindThreads();
    }else{
      threads.getThreads($stateParams.boardId, function(){
        bindThreads();
      });
    }

    function bindThreads(){
      $scope.threads = cards.getCurrentCards();

      $scope.$watch(function () { return cards.getCurrentCards(); }, 
        function (newCards, oldCards) {
          if (newCards !== oldCards) {
              $scope.threads = cards.getCurrentCards();
          }
        }
      );
    };

}])
.controller('searchBoardController', 
    ['$scope', '$stateParams', 'boards', 'cards', 
    function($scope, $stateParams, boards, cards){

    // Are the cards valid?
    if(cards.isValid()){
      bindBoards();
    }else{
      boards.getBoards(function(){
        bindBoards();
      });
    }

    function bindBoards(){
      $scope.boards = cards.getCurrentCards();

      $scope.$watch(function () { return cards.getCurrentCards(); }, 
        function (newCards, oldCards) {
          if (newCards !== oldCards) {
              $scope.boards = cards.getCurrentCards();
          }
        }
      );
    };

}])
.controller('overviewController', 
    ['$scope', 'boards', 'cards', function($scope, boards, cards){
    
    boards.getBoards(function(){
      $scope.boards = cards.getCurrentCards();
    });

}])
.controller('catalogController', 
    ['$scope', '$stateParams', 'cards', 'threads', 
    function($scope, $stateParams, cards, threads){

    threads.getThreads($stateParams.boardId, function(){
      $scope.threads = cards.getCurrentCards();
      console.log(cards.getCurrentCards());
    });

}])
.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state('overview', {
      url: '/home/board',
      templateUrl: 'index.html',
      views: {
      	'nav': {
      		templateUrl: 'navMain.html',
          controller: 'navMainController'
      	},
        'content':{
          templateUrl: 'boardOverview.html',
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
          controller: 'navMainController'
        },
        'content':{
          templateUrl: 'boardCatalog.html',
          controller: 'catalogController'
        }
      }
    })
    .state('searchBoards', {
      url: '/search/board/',
      templateUrl: 'index.html',
      views: {
        'nav': {
          templateUrl: 'navSearch.html',
          controller: 'navSearchController'
        },
        'content':{
          templateUrl: 'boardOverview.html',
          controller: 'searchBoardController'     
        }
      }
    })
    .state('searchThreads', {
      url: '/search/board/:boardId',
      templateUrl: 'index.html',
      views: {
      	'nav': {
      		templateUrl: 'navSearch.html',
          controller: 'navSearchController'
      	},
        'content':{
          templateUrl: 'boardCatalog.html',
          controller: 'searchThreadController'     
        }
      }
    })
	
	$urlRouterProvider.otherwise('/home/board');

    //.state('posts', {
    //	url: '/posts/{id}',
    //	templateUrl: 'templates/posts.html',
    //	controller: 'commentController'
    //});
   
}]);