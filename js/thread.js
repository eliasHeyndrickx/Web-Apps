var boardsModule = angular.module('threads', [])
	.factory('threads', ['$http', function($http){

			/*
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
			*/

			this.getThreads = function(boardId, callback){
				$http({
				  method: 'GET',
				  url: '/board/' + boardId + '/threads'
				}).then(function successCallback(response) {
			    callback(response);
			  }, function errorCallback(responsÒe) {
			    callback(false);
			  });
			};

			return this;
		}
]);