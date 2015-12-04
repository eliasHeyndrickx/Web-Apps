angular.module('hexChan')
	.factory('boards', ['$http', 'cards', function($http, cards){

			// Get board by Id
			this.getBoard = function(boardId, succes, error){
				$http({
					  method: 'GET',
					  url: '/board/' + boardId
				}).then(function successCallback(response){
						if(typeof succes === "function") succes(response.data);
				}, function errorCallback(response) {
				  	cards.setErrorState(true, response);
				  	if(typeof error === "function") error(false);
				});
				
			};

			// Get all boards
			this.getBoards = function(succes, error){
				$http({
				  method: 'GET',
				  url: '/boards'
				}).then(function successCallback(response) {
					cards.setCurrentCards(response.data);
					cards.setErrorState(false);
					if(typeof succes === "function") succes(response.data);
			  }, function errorCallback(response) {
			  	cards.setErrorState(true, response);
			  	if(typeof error === "function") error(false);
			  });
			};

			return this;
		}
]);