var boardsModule = angular.module('boards', [])
	.factory('boards', ['$http', function($http){

			this.getBoards = function(callback){
				$http({
				  method: 'GET',
				  url: '/boards'
				}).then(function successCallback(response) {
			    callback(response);
			  }, function errorCallback(responsÒe) {
			    console.log(response);
			    callback(false);
			  });
			}

			return this;

		}
]);