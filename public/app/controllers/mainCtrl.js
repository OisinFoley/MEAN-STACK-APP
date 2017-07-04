console.log('testing main Ctrl');

angular.module('mainCtrl',['authServices'])

.controller('mainCtrl',function(Auth, $location, $timeout, $rootScope, $window){

	var app = this;
	app.loadMe = false; //html will be hidden until this evaluates to true;
	/* app.loadMe is in use because we can see through throttling in chrome dev tools, that
	   some of the conditional elements still load temporarily if the user's connection is slow
	   obviously we don't want this, hence only setting loadMe to true once we know whether a user is 
	   signed in or not */

	/* https://stackoverflow.com/questions/22785775/difference-between-scope-and-rootscope
		rootScope defined by ng-app and has global access, $scope confined to its own controller where called */
	//anytime a route/view changes, it's ($routeScope) going to invoke this code
	$rootScope.$on('$routeChangeStart', function() {
		//calls the service upon initial load
		if(Auth.isLoggedIn()) {
			console.log("SUCCESS: user is logged in");
			app.isLoggedIn = true;
			//if user is logged in, we want to get their info, this verificiation is done back in authServices.js
			Auth.getUser().then(function(data){
				// console.log(data.data.username);
				app.username = data.data.username; //now accessible at front-end
				app.useremail = data.data.email; //now accessible at front-end
				app.loadMe = true;
			});
		}
		else {
			console.log("FAILURE: user is NOT logged in");
			//app.username = {};
			// app.username = false;
			app.username = ''; //neither '{}' nor 'false' work as hoped. they're literally copied.
			app.loadMe = true;
		}
		/*when we had the above if/else statement, but without the $rootscope.$on function, we would've had
		to refresh the page each time to check if user was loggin, now they update with each route/view change
		, as the code implies	*/

		if($location.hash() == '_=_') $location.hash(null);
	});
	
	this.facebook = function() {
		// console.log('test');
		// console.log($window.location);
		console.log($window.location.host); //localhost:8080
		console.log($window.location.protocol); //http
		// long way to manually change URL
		//doing this stops us from having multiple tabs for all of our test clicks. now a single redirect
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
	};

	this.twitter = function() {		
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
	};


	this.google = function() {		
		$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
	};

	this.doLogin = function(loginData){	
		app.loading = true;
		app.errorMsg = false; //ensures message disappears when we have a post success scenario

		Auth.login(app.loginData).then(function(data){
			if(data.data.success) {
				app.loading = false;								
				app.successMsg = data.data.message + '....Redirecting....';	
				console.log('form submitted');	

				$timeout(function(){				
					$location.path('/about');
					app.loginData = '';
					app.successMsg = false;
				}, 2000);								
			}
			else{
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};

	this.logout = function(){
		Auth.logout();
		$location.path('/logout');
		$timeout(function(){				
			$location.path('/');
		}, 2000);								
		
	}

});
