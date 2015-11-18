angular.module('hexChan')
	.factory('cards', [function(){

			// Listeners
			var listeners = [];

			// Used for filter
			var bufferCards = [];

			// Current card array
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

			// Discard current cards
			this.resetCards = function(){
				listeners = [];
				bufferCards = [];
				currentCards = [];
				errorState = false;
				init = false;
			};

			// Add listeners
			this.addSingleUseListener = function(callback){
				listeners.push(callback);
			};

			// Set currentCards
			this.setCurrentCards = function(cards){
				currentCards = cards;
				init = true;
				for (var i = 0, len = listeners.length; i < len; i++) {
					listeners[i]();
				}
				listeners = [];
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
			
				if(bufferCards.length != 0){
					currentCards = bufferCards;
					bufferCards	= [];
				}

				bufferCards = currentCards;

				currentCards = currentCards.filter(function(value){
					return regExp.test(value.title);
				});
			};
			
			return this;
		}
]);