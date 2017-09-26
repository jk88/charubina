angular.module('authService', [])



.factory('Auth', function($http, $q, AuthToken) {


	var authFactory = {};


	authFactory.login = function(username, password) {

		return $http.post('/api/login', {
			username: username,
			password: password
		})
		.success(function(data) {
			AuthToken.setToken(data, data.token);
			return data;
		})
	}

	authFactory.logout = function() {
		AuthToken.setToken();
	}

	authFactory.isLoggedIn = function() {
		if(AuthToken.getToken())
				return true;
		else
			return false;
	}

	authFactory.isLoggedAdmin = function() {
		if(AuthToken.getMeno() == "admin") {
			//alert("TRUE AuthToken.getMeno()=" + AuthToken.getMeno());
			return true;
		} else {
			//alert("FALSE AuthToken.getMeno()=" + AuthToken.getMeno());
			return false;
		}
	}

	authFactory.getUser = function() {
		if(AuthToken.getToken())
			return $http.get('/api/me');
		else
			return $q.reject({ message: "User has no token"});

	}

	/*authFactory.getUserProfil = function() {
		if(AuthToken.getToken())
			return $http.get('/api/mojProfil');
		else
			return $q.reject({ message: "User has no token"});

	}*/


	return authFactory;

})


.factory('AuthToken', function($window) {

	var authTokenFactory = {};

	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.getMeno = function() {
		return $window.localStorage.getItem('meno');
	}

	authTokenFactory.setToken = function(data, token) {

		if(token) {
			$window.localStorage.setItem('token', data.token);
			$window.localStorage.setItem('meno', data.meno);
		} else {
			$window.localStorage.removeItem('token');
			$window.localStorage.removeItem('meno');
		}

	}

	return authTokenFactory;

})


.factory('AuthInterceptor', function($q, $location, AuthToken) {

	var interceptorFactory = {};


	interceptorFactory.request = function(config) {

		var token = AuthToken.getToken();

		if(token) {

			config.headers['x-access-token'] = token;

		}

		return config;

	};

	


	return interceptorFactory;
});


