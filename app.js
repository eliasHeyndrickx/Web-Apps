var app = angular.module('hexChan', ['ngMaterial',  'ui.router', 'templates'])
.constant("hcConfig", {
  'sitename': '0xF Chan'
})
.controller('navMainController', 
  ['$scope', '$mdSidenav', '$state', '$stateParams', 'hcConfig', 'boards', 'threads', 'cards',
  function($scope, $mdSidenav, $state, $stateParams, hcConfig, boards, threads, cards){

  // Side nav toggle
  $scope.toggleNav = function() {
    $mdSidenav('left').toggle();
  };

  // Search
  cards.addInitAndChangeListener(function(currentCards){
    $scope.searchData = currentCards;
  });

  $scope.searchData = cards.getCurrentCards();
  // On Thread
  if($stateParams.hasOwnProperty('threadId')){

    $scope.boardId = $stateParams.boardId; // Set boardId
    $scope.threadId = $stateParams.threadId; // Set threadId

    // Get thread title
    threads.getThread($stateParams.threadId, function(thread){
      $scope.pageTitle = thread.title; // Set Title
    })

  // On Board
  }else if($stateParams.hasOwnProperty('boardId')){

    $scope.boardId = $stateParams.boardId; // Set boardId

    // Get board title
    boards.getBoard($stateParams.boardId, function(board){
      $scope.pageTitle = board.title;
    });

  }else{

    // On overview
    $scope.pageTitle = hcConfig.sitename;

  }

}])
.controller('menuController', 
  ['$scope', '$stateParams', 'cards', 
  function($scope, $stateParams, cards){

  // On thread
  if($stateParams.hasOwnProperty('threadId')){


  // On Board
  }else if($stateParams.hasOwnProperty('boardId')){

    // Set search filter
    $scope.searchTextUpdate = function(){
      cards.setFilter(new RegExp($scope.searchText, 'i'), 'title');
    };

  }else{

    // Set search filter
    $scope.searchTextUpdate = function(){
      cards.setFilter(new RegExp($scope.searchText, 'i'), 'title');
    };

  }
  
  // Searchbox, searchdata
  cards.addInitAndChangeListener(function(currentCards){
    $scope.searchData = currentCards;
  });

  $scope.searchData = cards.getCurrentCards();

}])
.controller('boardsController', 
  ['$scope', 'boards', 'cards', function($scope, boards, cards){
  
    // Reset the old cards.
    cards.resetCards();

    // Add a listener for change.
    cards.addInitAndChangeListener(function(currentCards){
      $scope.boards = currentCards;
    });

    // Get the current cards.
    boards.getBoards();

}])
.controller('threadsController', 
  ['$scope', '$http', '$state', '$stateParams', 'hcConfig', 'cards', 'threads', 
  function($scope, $http, $state, $stateParams, hcConfig, cards, threads){

    // New Thread
    $scope.newThread = function(){

      var fd = new FormData();
      fd.append('threadImg', $scope.myFile);

      fd.append('data', JSON.stringify({
        title: $scope.threadName,
        boardId: $stateParams.boardId
      }));

      $http.post('/thread/newThread', fd, {
        withCredentials : false,
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .success(function(response){
        window.location = '#/home/board/' + $stateParams.boardId;
      })
      .error(function(response){
        console.log(response);
      });
      
      
    };

    // Current thread
    $scope.boardId = $stateParams.boardId;

    // Check if on new thread.
    if(!$state.is('newThread')){
      // Reset the old cards.
      cards.resetCards();

      // Add a listener for change.
      cards.addInitAndChangeListener(function(currentCards){
        $scope.threads = currentCards;
      });

      // Get the current cards.
      threads.getThreads($stateParams.boardId);
    }

}])
.controller('postsController', 
  ['$scope', '$http', '$state', '$stateParams', 'cards', 'posts', 
    function($scope, $http, $state, $stateParams, cards, posts){
  
  $scope.hideImg = function(post){
    return Boolean(post.img);
  };

  $scope.newPost = function(){

    var fd = new FormData();

    if($scope.hasOwnProperty('myFile'))
      fd.append('postImg', $scope.myFile);

    fd.append('data', JSON.stringify({
      content: $scope.content,
      threadId: $stateParams.threadId
    }));
    
    $http.post('/post/newPost', fd, {
      withCredentials: false,
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .success(function(response){
      window.location = "#/home/board/" + $stateParams.boardId + "/" + $stateParams.threadId;
    })
    .error(function(response){
      console.log(response);
    });
  }

  if(!$state.is('newPost')){
    posts.getPosts($stateParams.threadId, function(){
      $scope.posts = cards.getCurrentCards();
    });
  }

}])
.directive('hcHref', [function() {
    return {
        link: function(scope, element, attrs) {
            element.on('click', function() {
                scope.$apply(function() {
                  window.location = attrs.hcHref;
                });
            });
        }
    }
}])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.config(['$mdThemingProvider', '$stateProvider','$urlRouterProvider',
	function($mdThemingProvider, $stateProvider, $urlRouterProvider){

  // Set Theme
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple', {
      'default': '500',/*
      '': '',
      '': '',
      '': ''*/
    })
    .accentPalette('purple', {
      'default': 'A100', /*
      '': '',
      '': '',
      '': ''*/
    });

  // Set Routes
  $stateProvider
    .state('board', {
      abstract: true,
      url: '/home/board',
      templateUrl: 'index.html',
      views: {
      	'nav': {
      		templateUrl: 'navMain.html',
          controller: 'navMainController'
      	},
        'content':{
          templateUrl: 'boards.html',
          controller: 'boardsController'
        }
      }
    })
    .state('board.menu', {
      url: '',
      views: {
        'menu':{
          templateUrl: 'menuBoard.html',
          controller: 'menuController'
        }
      }
    })
    .state('thread', {
      abstract: true,
      url: '/home/board/:boardId',
      templateUrl: 'index.html',
      views: {
        'nav': {
          templateUrl: 'navMain.html',
          controller: 'navMainController'
        },
        'sideNavOptions':{
          templateUrl: 'sideNavThread.html',
          controller: 'navMainController'
        },
        'content':{
          templateUrl: 'threads.html',
          controller: 'threadsController'
        }
      }
    })
    .state('thread.catalog', {
      url: '',
      views: {
        'menu': {
          templateUrl: 'menuThread.html',
          controller: 'menuController'
        }
      }
    })
    .state('thread.newThread', {
      url: '/newThread',
      views: {
        'menu': {
          templateUrl: '',
          controller: 'navMainController'
        },
        'sideNavOptions@':{
          templateUrl: '',
          controller: ''
        },
        'content@': {
          templateUrl: 'threadsNewThread.html',
          controller: 'threadsController'
        }
      }
    })
    .state('post', {
      abstract: true,
      url: '/home/board/:boardId/:threadId',
      templateUrl: 'index.html',
      views: {
        'nav': {
          templateUrl: 'navMain.html',
          controller: 'navMainController'
        },
        'content':{
          templateUrl: 'posts.html',
          controller: 'postsController'
        }
      }
    })
    .state('post.view', {
      url: '',
      views: {
        'menu': {
          templateUrl: 'menuPost.html',
          controller: 'menuController'
        }
      }
    })
    .state('post.newPost', {
      url: '/newPost',
      views: {
        'menu': {
          templateUrl: '',
          controller: 'navMainController'
        },
        'sideNavOptions@':{
          templateUrl: '',
          controller: ''
        },
        'content@': {
          templateUrl: 'postsNewPost.html',
          controller: 'postsController'
        }
      }
    })


	$urlRouterProvider.otherwise('/home/board');

}]);





