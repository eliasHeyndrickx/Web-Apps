angular.module('hexChan')
	.factory('boards', ['$http', 'cards', function($http, cards){

			this.getBoard = function(id, callback){
				$http({
					  method: 'GET',
					  url: '/board/' + id
					}).then(function successCallback(response) {
						callback(response.data[0]);
				  }, function errorCallback(response) {
				  	console.log(response.data);
						callback(false);
				  });
				
			};

			this.getBoards = function(callback){
				$http({
				  method: 'GET',
				  url: '/boards'
				}).then(function successCallback(response) {
					cards.setCurrentCards(response.data);
					cards.setErrorState(false);
			 		callback();
			  }, function errorCallback(response) {
			  	console.log(response.data);
			  	cards.setErrorState(true);
			  	callback();
			  });
			};

			return this;
		}
]);