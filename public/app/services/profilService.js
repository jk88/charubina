angular.module('profilService', [])


.factory('Profil', function($http) {


	var profilFactory = {};

	profilFactory.mojProfil = function() {
		return $http.get('/api/mojProfil');
	}

	profilFactory.update = function(userData) {
		return $http.post('/api/update_profil', userData);
	}


	return profilFactory;


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