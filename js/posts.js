angular.module('hexChan')
	.factory('posts', ['$http', 'cards', function($http, cards){

			// Get all threads for thread
			this.getPosts = function(threadId, callback){
				$http({
				  method: 'GET',
				  url: '/posts/' + threadId
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