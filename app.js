var app = angular.module('hexChan', ['ngMaterial',  'ui.router', 'templates'])
.constant("hcConfig", {
  'sitename': '0xF Chan'
})
.controller('navMainController', 
  ['$scope', '$mdSidenav', '$state', '$stateParams', 'hcConfig', 'auth', 'boards', 'threads', 'cards',
  function($scope, $mdSidenav, $state, $stateParams, hcConfig, auth, boards, threads, cards){

  // Side nav toggle
  $scope.toggleNav = function() {
    $mdSidenav('left').toggle();
  };

  // Is logged in
  $scope.isLoggedIn = function(){
    return auth.isLoggedIn();
  }

  $scope.logout = function(){
    auth.logOut();
    window.location = "#/home/board";
  }

  // Search
  cards.addInitAndChangeListener(function(currentCards){
    $scope.searchData = currentCards;
  });

  $scope.searchData = cards.getCurrentCards();

  // Board catalog
  if($state.includes('board')){

    // Set main title
    $scope.pageTitle = hcConfig.sitename;

  
  // On thread catalog of board
  }else if($state.includes('thread')){
    

    $scope.boardId = $stateParams.boardId; // Set boardId

    // Get board title
    boards.getBoard($stateParams.boardId, function(board){
      $scope.pageTitle = board.title;
    });


  // On thread, with list of posts
  }else if($state.includes('post')){
    $scope.boardId = $stateParams.boardId;    // Set boardId
    $scope.threadId = $stateParams.threadId;  // Set threadId

    // Get thread title
    threads.getThread($stateParams.threadId, function(thread){
      $scope.pageTitle = thread.title;  // Set Title
    })

  // On error page (not found).
  }else if($state.includes('error')){
    $scope.pageTitle = hcConfig.sitename;

    $scope.message = ($stateParams.errorType === "board") ? "Board not found!" : "Thread not found!";
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

      // Display not found page
      

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
      .success(function(res){
        window.location.replace('#/home/board/' + res.boardId + "/" + res._id);
      })
      .error(function(res){
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
      threads.getThreads($stateParams.boardId, function(){
        // Valid thread
      }, function(){
        window.location.replace('#/error/board');
      });
    }

}])
.controller('postsController', 
  ['$scope', '$http', '$state', '$compile', '$stateParams', 'auth', 'cards', 'posts',
    function($scope, $http, $state, $compile, $stateParams, auth, cards, posts){

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
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined,
        'Authorization': 'Bearer ' + auth.getToken()
      }
    })
    .success(function(response){
      window.location.replace("#/home/board/" + $stateParams.boardId + "/" + $stateParams.threadId);
    })
    .error(function(response){
      console.log(response);
    });
  }

  if(!$state.is('newPost')){

    posts.getPosts($stateParams.threadId, function(){
      var posts = cards.getCurrentCards();
      $scope.posts = cards.getCurrentCards();
    }, function(){
      window.location.replace('#/error/thread');
    });

  }

}])
.controller('AuthController',
  ['$scope', 'auth', function($scope, auth){

    var user = {};
    
    $scope.register = function(){

      user = {
        username: $scope.username,
        password: $scope.password
      };

      auth.register(JSON.stringify(user), function(){
        window.location.replace("#/home/board");
      })
    };
    
    $scope.logIn = function(){

      user = {
        username: $scope.username,
        password: $scope.password
      };

      auth.logIn(JSON.stringify(user), function(){
        window.location.replace("#/home/board");
      })
      
    };

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
.filter('postFormatter', function() {
  return function(input) {
    if(typeof input !== "undefined"){
      for(var i = 0, l = input.length; i < l; i++){
        if(!input[i].author) input[i].author = "anonymous";
      }
      return input;
    }
  };
})
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
    .state('login', {
      url: '/login',
      templateUrl: 'index.html',
      views: {
        'nav': {
          templateUrl: 'navMain.html',
          controller: 'navMainController'
        },
        'content':{
          templateUrl: 'login.html',
          controller: 'AuthController'
        }
      }
    })
    .state('register', {
      url: '/register',
      templateUrl: 'index.html',
      views: {
        'nav': {
          templateUrl: 'navMain.html',
          controller: 'navMainController'
        },
        'content':{
          templateUrl: 'register.html',
          controller: 'AuthController'
        }
      }
    })
    .state('error', {
      url: '/error/:errorType',
      templateUrl: 'index.html',
      views: {
        'nav': {
          templateUrl: 'navMain.html',
          controller: 'navMainController'
        },
        'content': {
          templateUrl: 'errorBoard.html',
          controller: 'navMainController'
        }
      }
    })
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
        },
        'sideNavOptions': {
          'templateUrl': 'sideNavGeneral.html',
          'controller': 'navMainController'
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
          templateUrl: 'sideNavGeneral.html',
          controller: 'navMainController'
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
        },
        'sideNavOptions@':{
          templateUrl: 'sideNavPost.html',
          controller: 'navMainController'
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
          templateUrl: 'sideNavGeneral.html',
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





