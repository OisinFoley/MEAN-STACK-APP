// app.js(linked back to index itself) references this as a dependency.
var app = angular.module('appRoutes',['ngRoute'])

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
		controllerAs: 'register',
		authenticated: false //route only available if var set to false
	})
	.when('/login', { 
		templateUrl: 'app/views/pages/users/login.html',
		authenticated: false
	})
	.when('/logout', { 
		templateUrl: 'app/views/pages/users/logout.html',
		authenticated: true
	})
	.when('/profile', { 
		templateUrl: 'app/views/pages/users/profile.html',
		authenticated: true
	})
	.when('/facebook/:token', { 
		templateUrl: 'app/views/pages/users/social/social.html',
		controller:'facebookCtrl',
		controllerAs:'facebook',
		authenticated: false
	})
	.when('/twitter/:token', { 
		templateUrl: 'app/views/pages/users/social/social.html',
		controller:'twitterCtrl',
		controllerAs:'twitter',
		authenticated: false
	})

	.when('/google/:token', { 
		templateUrl: 'app/views/pages/users/social/social.html',
		controller:'googleCtrl',
		controllerAs:'google',
		authenticated: false
	})

	.when('/facebookerror', { 
		templateUrl: 'app/views/pages/users/login.html',
		controller:'facebookCtrl',
		controllerAs:'facebook',
		authenticated: false
	})

	.when('/twittererror', { 
		templateUrl: 'app/views/pages/users/login.html',
		controller:'twitterCtrl',
		controllerAs:'twitter',
		authenticated: false
	})

	.when('/googleerror', { 
		templateUrl: 'app/views/pages/users/login.html',
		controller:'googleCtrl',
		controllerAs:'google',
		authenticated: false
	}) 

	.when('/activate/:token', { 
		templateUrl: 'app/views/pages/users/activation/activate.html',
		controller:'emailCtrl',
		controllerAs:'email'
	}) 

	.otherwise({ redirectTo: '/' }) //handles unrecognised values

	//this, along with base href, will allow us to remove the '#' at the base url, currently needed because of Angular
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});

	//console.log('testing our routes file');
});

app.run(['$rootScope','Auth','$location',function($rootScope, Auth, $location) {


$rootScope.$on('$routeChangeStart', function(event,next,current) {		
		//console.log(Auth.isLoggedIn());
		//console.log(next.$$route);
		if(next.$$route.authenticated){ //if route requires authenticated to be true
			if(!Auth.isLoggedIn()) {
				//same as when wanting to submit a form but not be redirected
				//change url manually to see its prevention to unwanted paths
				event.preventDefault();
				//without next line it'll display just the index.html's content, even though by default we should 
				//also have /home.html's view being displayed within the index
				$location.path('/');
			}
			//console.log('needs to be authenticated');
		} 	else if (!next.$$route.authenticated) {
				if(Auth.isLoggedIn()) {				
					event.preventDefault();				
					$location.path('/profile');
				}
			//console.log('DOES NOT need to be authenticated');
		} 	else {
				console.log('authenticaation does not matter here');
		}	
	});		
}]);

