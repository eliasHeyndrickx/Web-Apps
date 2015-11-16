angular.module('hexChan')
	.factory('cards', [function(){

			// Used for filter
			var buffercards = [];

			var currentCards = [];

			// Has there been an error an retrieval of the data
			var errorState = false;

			// Has cards beein intialized?
			var init = false;

			// Is the card service cache valid ?
			this.isValid = function(){
				return init && !errorState;
			};

			this.isCacheValid = function(){
				return init;
			};

			// Set currentCards
			this.setCurrentCards = function(cards){
				init = true;
				currentCards = cards;
			};

			// Get current cards
			this.getCurrentCards = function(){
				return currentCards;
			};

			// Set error messages
			this.setErrorState = function(errState){
				errorState = errState;
			};

			// Get error messages
			this.getErrorState = function(){
				return errorState;
			};

			// Set filter
			this.setFilter = function(regExp){
			
				if(buffercards.length != 0){
					currentCards = buffercards;
					buffercards	= [];
				}

				buffercards = currentCards;

				currentCards = currentCards.filter(function(value){
					return regExp.test(value.title);
				});
			};
			
			return this;
		}
]);