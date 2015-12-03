angular.module('hexChan')
	.factory('boards', ['$http', 'cards', function($http, cards){

			// Get board by Id
			this.getBoard = function(boardId, callback){
				$http({
					  method: 'GET',
					  url: '/board/' + boardId
				}).then(function successCallback(response){
						if(typeof callback === "function") callback(response.data);
				}, function errorCallback(response) {
				  	cards.setErrorState(true, response);
				  	if(typeof callback === "function") callback(false);
				});
				
			};

			// Get all boards
			this.getBoards = function(callback){
				$http({
				  method: 'GET',
				  url: '/boards'
				}).then(function successCallback(response) {
					cards.setCurrentCards(response.data);
					cards.setErrorState(false);
					if(typeof callback === "function") callback(response.data);
			  }, function errorCallback(response) {
			  	cards.setErrorState(true, response);
			  	if(typeof callback === "function") callback(false);
			  });
			};

			return this;
		}
]);