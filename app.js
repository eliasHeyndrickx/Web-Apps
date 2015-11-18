var app = angular.module('hexChan', ['ngMaterial', 'ui.router', 'templates'])
.constant("sitename", "0xF Chan")
.controller('navMainController', 
  ['$scope', '$mdSidenav', '$stateParams',  'sitename', 'boards', 'cards',
  function($scope, $mdSidenav, $stateParams, sitename, boards, cards){

  // Reset the cards first
  cards.resetCards();

  $scope.toggleNav = function() {
    $mdSidenav('left').toggle();
  };

  cards.addSingleUseListener(function(){
    $scope.currentCards = cards.getCurrentCards();
    //$scope.selectedCard = $scope.currentCards[0];
  });

  //
  $scope.selectedCardUpdate = function(){
    cards.setFilter(new RegExp($scope.searchText, "i"));
    $scope.currentCards = cards.getCurrentCards();
  }

  // Search bar
  $scope.searchTextUpdate = function(){
    cards.setFilter(new RegExp($scope.searchText, "i"));
    $scope.currentCards = cards.getCurrentCards();
  };

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
.controller('overviewController', 
    ['$scope', 'boards', 'cards', function($scope, boards, cards){
    
    boards.getBoards(function(){
      $scope.boards = cards.getCurrentCards();
    });

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
.controller('catalogController', 
    ['$scope', '$stateParams', 'cards', 'threads', 
    function($scope, $stateParams, cards, threads){

    threads.getThreads(function(){
      $scope.threads = cards.getCurrentCards();
    });

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
.config(['$mdThemingProvider', '$stateProvider','$urlRouterProvider',
	function($mdThemingProvider, $stateProvider, $urlRouterProvider){

  // Set Theme
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('orange');

  // Set Routes
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
      abstract: true,
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
    .state('board.catalog', {
      url: '/catalog',
      views: {
        'menu': {
          templateUrl: 'menuCatalog.html',
          controller: 'navMainController'
        }
      }
    })
    .state('board.newThread', {
      url: '/newThread',
      views: {
        'menu': {
          templateUrl: '',
          controller: 'navMainController'
        },
        'content@': {
          templateUrl: 'boardNewThread.html'
        }
      }
    })
	
	$urlRouterProvider.otherwise('/home/board');

}]);





