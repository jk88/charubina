angular.module('oznamyService', [])


.factory('Oznamy', function($http) {


	var oznamyFactory = {};

	/*oznamyFactory.allOznamies = function() {
		return $http.get('/api/all_oznamies');
	}*/

	oznamyFactory.all = function() {
		return $http.get('/api/oznamy');
	}

	oznamyFactory.create = function(oznamyData) {
		return $http.post('/api/oznamy', oznamyData);
	}

	oznamyFactory.update = function(oznamyData) {
		return $http.post('/api/update_oznamy', oznamyData);
	}

	oznamyFactory.delete = function(oznamyData) {
		return $http.post('/api/remove_oznamy', oznamyData);
	}


	

	return oznamyFactory;


})

.factory('socketio', function($rootScope) {

	var socket = io.connect();
	return {

		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}

	};

});