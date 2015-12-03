angular.module('hexChan')
	.factory('threads', ['$http', 'cards', function($http, cards){

			// Get thread by Id
			this.getThread = function(threadId, callback){
				$http({
				  method: 'GET',
				  url: '/thread/' + threadId
				}).then(function successCallback(response) {
					cards.setErrorState(false);
					if(typeof callback === 'function') callback(response.data);
			  }, function errorCallback(response) {
			    cards.setErrorState(true, response);
			    if(typeof callback === 'function') callback(false);
			  });
			};

			// Get all threads for board
			this.getThreads = function(boardId, callback){
				$http({
				  method: 'GET',
				  url: '/threads/' + boardId
				}).then(function successCallback(response) {
					cards.setCurrentCards(response.data);
					cards.setErrorState(false);
			  	if(typeof callback === 'function') callback(response.data);
			  }, function errorCallback(response) {
			    cards.setErrorState(true, response);
			  	if(typeof callback === 'function') callback(false);
			  });
			};
			
			return this;
		}
]);