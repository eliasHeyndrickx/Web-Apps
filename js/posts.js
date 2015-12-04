angular.module('hexChan')
	.factory('posts', ['$http', 'cards', function($http, cards){

			// Get all threads for thread
			this.getPosts = function(threadId, succes, error){
				$http({
				  method: 'GET',
				  url: '/posts/' + threadId
				}).then(function successCallback(response) {
					cards.setCurrentCards(response.data);
					cards.setErrorState(false);
			  	if(typeof succes === "function") succes(succes.data);
			  }, function errorCallback(response) {
			    cards.setErrorState(true, response);
			  	if(typeof error === "function") error(false);
			  });
			};
			
			return this;
		}
]);