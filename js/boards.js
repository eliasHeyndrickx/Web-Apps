var boardsModule = angular.module('boards', [])
	.factory('boards', ['$http', function($http){

			this.getBoard = function(id, callback){
				$http({
					  method: 'GET',
					  url: '/board/' + id
					}).then(function successCallback(response) {
				    callback(response);
				  }, function errorCallback(responsÒe) {
				    callback(false);
				  });
				
			};

			this.getBoards = function(callback){
				$http({
				  method: 'GET',
				  url: '/boards'
				}).then(function successCallback(response) {
			    callback(response);
			  }, function errorCallback(responsÒe) {
			    callback(false);
			  });
			};

			return this;
		}
]);