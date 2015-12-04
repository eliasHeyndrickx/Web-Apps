angular.module('hexChan')
	.factory('threads', ['$http', 'cards', function($http, cards){

			// Get thread by Id
			this.getThread = function(threadId, succes, error){
				$http({
				  method: 'GET',
				  url: '/thread/' + threadId
				}).then(function successCallback(response) {
					cards.setErrorState(false);
					if(typeof succes === 'function') succes(response.data);
			  }, function errorCallback(response) {
			    cards.setErrorState(true, response);
			    if(typeof error === 'function') error(false);
			  });
			};

			// Get all threads for board
			this.getThreads = function(boardId, succes, error){
				$http({
				  method: 'GET',
				  url: '/threads/' + boardId
				}).then(function successCallback(response) {
					cards.setCurrentCards(response.data);
					cards.setErrorState(false);
			  	if(typeof succes === 'function') succes(response.data);
			  }, function errorCallback(response){
			    cards.setErrorState(true, response);
			  	if(typeof error === 'function') error(false);
			  });
			};
			
			return this;
		}
]);