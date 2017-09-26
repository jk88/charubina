angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl', 'reverseDirective', 'navstevyCtrl', 'navstevyService', 'ulovkyCtrl', 'ulovkyService', 'profilCtrl', 'profilService'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})