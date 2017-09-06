// app.js(linked back to index itself) references this as a dependency.
var app = angular.module('appRoutes',['ngRoute'])

//not all routes are accessible throuhg clicks, but they're not required to be either

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
	.when('/contentHome', { 
		templateUrl: 'app/views/pages/contentHome.html',
		authenticated: false
	})
	.when('/chatHolder', { 
		templateUrl: 'app/views/pages/content/chatHolder.html',
		//controller: 'feedCtrl',
		//controllerAs: 'feed',
		authenticated: false
	})
	.when('/feed', { 
		templateUrl: 'app/views/pages/content/feed.html',
		controller: 'feedCtrl',
		controllerAs: 'feed',
		authenticated: false
	})
	.when('/forum', { 
		templateUrl: 'app/views/pages/content/forum.html',
		controller: 'forumCtrl',
		controllerAs: 'forum',
		authenticated: false
	})
	.when('/thread/:_id', { 
		templateUrl: 'app/views/pages/content/thread.html',
		controller: 'forumCtrl',
		controllerAs: 'forum',
		authenticated: false
	})
	.when('/imageTest', { 
		templateUrl: 'app/views/pages/content/imageTest.html',
		controller: 'imageCtrl',
		controllerAs: 'image',
		authenticated: false
	})
	.when('/discover', { 
		templateUrl: 'app/views/pages/content/discover.html',
		controller: 'TypeAheadController',
		authenticated: false
	})
	.when('/addInterests', { 
		templateUrl: 'app/views/pages/addInterests.html',
		authenticated: false
	})
	.when('/chat', { 
		templateUrl: 'app/views/pages/chat.html',
		authenticated: false
	})
	.when('/learn', { 
		templateUrl: 'app/views/pages/content/learn.html',
		controller: 'TypeAheadController',
		controllerAs: 'typeahead',
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
	.otherwise({ redirectTo: '/' }) //handles unrecognised values

	//this, along with base href, will allow us to remove the '#' at the base url, currently needed because of Angular
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});

	
});

app.run(['$rootScope','Auth','$location',function($rootScope, Auth, $location) {


$rootScope.$on('$routeChangeStart', function(event,next,current) {				
		if(next.$$route.authenticated){ //if route requires authenticated to be true
			if(!Auth.isLoggedIn()) {
				
				//without this, index renders but not it's nested view				
				event.preventDefault();
				
				$location.path('/');
			}
			
		} 	else if (!next.$$route.authenticated) {
				if(Auth.isLoggedIn()) {				
					event.preventDefault();				
					$location.path('/feed');
				}			
		} 	else {
				console.log('authenticaation does not matter here');
		}	
	});		
}]);

