// app.js(linked back to index itself) references this as a dependency.
angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
//on index page, hrefs needs to be '#/abcd' because of Angular, normally just '/' will suffice
	$routeProvider
	.when('/', {
		templateUrl: 'app/views/pages/home.html'
	})
	.when('/about', { //when copying&pasting, remember to actually add a directory!! Lost 40 minutes with this
		templateUrl: 'app/views/pages/about.html'
	})
	.when('/register', { //when copying&pasting, remember to actually add a directory!! Lost 40 minutes with this
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register'
	})

	.otherwise({ redirectTo: '/' }) //handles unrecognised values

	//this, along with base href, will allow us to remove the '#' at the base url, currently needed because of Angular
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});

	//console.log('testing our routes file');
});
