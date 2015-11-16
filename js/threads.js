angular.module('hexChan')
	.factory('threads', ['$http', 'cards', function($http, cards){

			this.getThreads = function(boardId, callback){
				$http({
				  method: 'GET',
				  url: '/board/' + boardId + '/threads'
				}).then(function successCallback(response) {
					Succes(response.data, callback);
			  }, function errorCallback(response) {
			    console.log(response.data);
			    Failure(callback);
			  });
			};

			function Succes(response, callback){
				cards.setCurrentCards(response);
				cards.setErrorState(false);
			  callback();
			};

			function Failure(callback){
				cards.setErrorState(true);
			  callback();
			}

			return this;
		}
]);