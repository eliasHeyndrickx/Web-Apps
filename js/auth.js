angular.module('hexChan')
.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};

  auth.saveToken = function (token){
	  $window.localStorage['hexchan-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['hexchan-token'];
	}

	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
	    var loginData = JSON.parse($window.atob(token.split('.')[1]));

	    return loginData.exp > Date.now() / 1000;
	  } else {
	    return false;
	  }
	};

	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var loginData = JSON.parse($window.atob(token.split('.')[1]));
	    return loginData.username;
	  }
	};

	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logIn = function(user, cb){
	  return $http.post('/login', user).success(function(data){
	    auth.saveToken(data.token);
	    cb();
	  });
	};

	auth.logOut = function(){
  	$window.localStorage.removeItem('hexchan-token');
	};

  return auth;
}])