angular.module('ulovkyService', [])


.factory('Ulovky', function($http) {


	var ulovkyFactory = {};

	ulovkyFactory.allUlovkies = function() {
		return $http.get('/api/all_ulovkies');
	}

	ulovkyFactory.all = function() {
		return $http.get('/api/ulovky');
	}

	ulovkyFactory.create = function(ulovkyData) {
		return $http.post('/api/ulovky', ulovkyData);
	}

	ulovkyFactory.update = function(ulovkyData) {
		return $http.post('/api/update_ulovky', ulovkyData);
	}

	ulovkyFactory.delete = function(ulovkyData) {
		return $http.post('/api/remove_ulovky', ulovkyData);
	}
	


	ulovkyFactory.all2 = function() {
		return $http.get('/api/oznamyUlovky');
	}

	ulovkyFactory.create2 = function(oznamyUlovkyData) {
		return $http.post('/api/oznamyUlovky', oznamyUlovkyData);
	}

	ulovkyFactory.update2 = function(oznamyUlovkyData) {
		return $http.post('/api/update_oznamyUlovky', oznamyUlovkyData);
	}

	ulovkyFactory.delete2 = function(oznamyUlovkyData) {
		return $http.post('/api/remove_oznamyUlovky', oznamyUlovkyData);
	}

	return ulovkyFactory;


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