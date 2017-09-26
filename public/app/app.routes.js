angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html'
		})
		.when('/kniha-navstev', {
			templateUrl: 'app/views/pages/kniha-navstev.html'
		})
		.when('/prazdne', {
			templateUrl: 'app/views/pages/prazdne.html'
		})
		.when('/zapis-ulovku', {
			templateUrl: 'app/views/pages/zapis-ulovku.html'
		})
		.when('/logout', {
			templateUrl: 'app/views/pages/logout.html'
		})
		.when('/profil', {
			templateUrl: 'app/views/pages/profil.html'
		})
		.when('/historia', {
			templateUrl: 'app/views/pages/historia.html'
		})
		.when('/allStories', {
			templateUrl: 'app/views/pages/allStories.html',
			controller: 'AllStoriesController',
			controllerAs: 'story',
			resolve: {
				stories: function(Story) {
					return Story.allStories();
				}
			}

		})

	$locationProvider.html5Mode(true);

})