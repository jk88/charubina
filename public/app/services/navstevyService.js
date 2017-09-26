angular.module('navstevyService', [])


.factory('Navstevy', function($http) {


	var navstevyFactory = {};

	navstevyFactory.allNavstevies = function() {
		return $http.get('/api/all_navstevies');
	}

	navstevyFactory.all = function() {
		return $http.get('/api/navstevy');
	}

	navstevyFactory.create = function(navstevyData) {
		return $http.post('/api/navstevy', navstevyData);
	}

	navstevyFactory.update = function(navstevyData) {
		return $http.post('/api/update_navstevy', navstevyData);
	}

	navstevyFactory.delete = function(navstevyData) {
		return $http.post('/api/remove_navstevy', navstevyData);
	}



	navstevyFactory.all2 = function() {
		return $http.get('/api/oznamyNavstevy');
	}

	navstevyFactory.create2 = function(oznamyNavstevyData) {
		return $http.post('/api/oznamyNavstevy', oznamyNavstevyData);
	}

	navstevyFactory.update2 = function(oznamyNavstevyData) {
		return $http.post('/api/update_oznamyNavstevy', oznamyNavstevyData);
	}

	navstevyFactory.delete2 = function(oznamyNavstevyData) {
		return $http.post('/api/remove_oznamyNavstevy', oznamyNavstevyData);
	}
	

	return navstevyFactory;


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