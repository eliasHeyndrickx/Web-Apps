var app = angular.module('hexChan', ['ngMaterial',  'ui.router', 'templates'])
.constant("hcConfig", {
  'sitename': '0xF Chan',
  'threadImgRatio': 1.5 
})
.controller('navMainController', 
  ['$scope', '$mdSidenav', '$stateParams',  'hcConfig', 'boards', 'cards',
  function($scope, $mdSidenav, $stateParams, hcConfig, boards, cards){

  // Reset the cards first
  cards.resetCards();

  $scope.toggleNav = function() {
    $mdSidenav('left').toggle();
  };

  cards.addSingleUseListener(function(){
    $scope.currentCards = cards.getCurrentCards();
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
    $scope.pageTitle = hcConfig.sitename;
  }

}])
.controller('boardsController', 
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
.controller('threadsController', 
  ['$scope', '$http', '$state', '$stateParams', 'hcConfig', 'cards', 'threads', 
  function($scope, $http, $state, $stateParams, hcConfig, cards, threads){

    // New Thread
    $scope.newThread = function(){

      // Resize images
      var cvs = document.createElement('canvas');
      var cvc = cvs.getContext("2d");

      var img = document.createElement("img");
      var fileReader = new FileReader();  
      fileReader.onload = function(e) {img.src = e.target.result}
      fileReader.readAsDataURL($scope.myFile);


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
        console.log(response);
      })
      .error(function(response){
        console.log(response);
      });
        /*
      $http({
        method: 'POST',
        url: '/thread/newThread',
        transformRequest: function(data){
          var formData = new FormData();

          formData.append("model", angular.toJson(data.model));
          formData.append("file", myFile);

          return formData;
        },
        data: {model: $scope.model, file: $scope.file},
        headers: {'Content-Type': false}
      }).then(function successCallback(response) {
        window.location = '#/home/board/' + $stateParams.boardId;
      }, function errorCallback(response) {
        console.log(response);
      });*/
      
    };

    // Check if on new thread.
    if(!$state.is('newThread')){
      threads.getThreads($stateParams.boardId, function(){
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
    }

}])
.directive('hcNav', [function() {
    return {
        link: function(scope, element, attrs) {
            element.on('click', function() {
                scope.$apply(function() {
                  window.location = attrs.hcNav;
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
          controller: 'navMainController'
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
          controller: 'navMainController'
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
        'content@': {
          templateUrl: 'threadsNewThread.html',
          controller: 'threadsController'
        }
      }
    })
	
	$urlRouterProvider.otherwise('/home/board');

}]);





