//console.log('testing main Ctrl');

angular.module('mainCtrl',['authServices'])

.controller('mainCtrl',function(Auth, $location, $timeout, $rootScope, $window,$scope){

	this.toggleFade = true;
	this.startResize = false;
	this.testResize = false;
	this.testInnerResize = false;
	this.fadeLoginModal = true;
	$scope.isNavCollapsed = true;
  $scope.isCollapsed = false;
  $scope.isCollapsedHorizontal = false;
	// does not behave as hoped, arrow still out of place onload
	// this.mapQuickScroller = {	    				    
	// 			    "position" : "absolute",
	// 			    //ensures icon follows the document as it's scrolled
	// 			    "top" : window.pageYOffset + (screen.height* .8) +"px",
	// 			    "left" : screen.width* .95 +"px",				    
	//     			"width": screen.width*.07+"px",
	//     			"height": screen.height*.12+"px",
	//     			"cursor":"pointer",
	//     			"z-index": 1032
	// 			};	


	var app = this;


	app.loadMe = false; //html will be hidden until this evaluates to true;
	/* app.loadMe is in use because we can see through throttling in chrome dev tools, that
	   some of the conditional elements still load temporarily if the user's connection is slow
	   obviously we don't want this, hence only setting loadMe to true once we know whether a user is 
	   signed in or not */

	/* https://stackoverflow.com/questions/22785775/difference-between-scope-and-rootscope
		rootScope defined by ng-app and has global access, $scope confined to its own controller where called */
	//anytime a route/view changes, it's ($routeScope) going to invoke this code
	

	app.chatLoggedIn = false;
	app.hideIntro = true;

	$rootScope.$on('$routeChangeStart', function() {
		//calls the service upon initial load
		if(Auth.isLoggedIn()) {
			console.log("SUCCESS: user is logged in");
			app.isLoggedIn = true;
			//if user is logged in, we want to get their info, this verificiation is done back in authServices.js
			Auth.getUser().then(function(data){
				// console.log("data.data is %s",data.data.id);
				app.id = data.data.id;
				app.uuid = data.data.uuid;

				app.username = data.data.username; //now accessible at front-end
				app.useremail = data.data.email; //now accessible at front-end
				app.loadMe = true;
			});
		}
		else {
			console.log("Reminder: user is NOT logged in");					
			app.username = ''; //neither '{}' nor 'false' work as hoped. they're literally copied.
			app.loadMe = true;
		}
		/*when we had the above if/else statement, but without the $rootscope.$on function, we would've had
		to refresh the page each time to check if user was loggin, now they update with each route/view change
		, as the code implies	*/

		if($location.hash() == '_=_') $location.hash(null);
	});
	
		//had tried setting initial styling here, then later referencing this snippet as the user scrolls
		//not all of the styling is applying here though, so have just set syling onscroll insead.
		// therefore the chat div is out of position if toggled before scrolling
		// $scope.mapChatDiv = {
		// 		"z-index": 1, 	    			    
		// 	     "position" : "absolute",
		// 	    // //ensures icon follows the document as it's scrolled
		// 	    "top" : window.pageYOffset + (screen.height* .15) +"px",
		// 	    "left" : screen.width* .01 +"px"			 
		// 	};
	

	

	$scope.hideQuickScroll = false;

	$window.onscroll = function() {
	  console.log('scroll');
	  
	  //sets up a digest, aka getting view to redraw/bind
		$scope.$apply(function() {
			var a = window.pageYOffset;
  				var b = screen.height;	    
  				var c = screen.width;	    


  				$scope.testResize = false;
				$scope.testInnerResize = false;
  				$scope.startResize = false;	

			if(window.pageYOffset > 200){
		  	
			  	$scope.hideQuickScroll = false;
			  	$scope.startResize = true;	

  				var newYpos = a + (b*.8);
  				console.log("calculated y-pos %s ",newYpos);

  				var newXpos = (c*.95);
  				console.log("calculated x-pos %s ",newXpos);

  				$scope.mapQuickScroller = {	    				    
				    "position" : "absolute",
				    //ensures icon follows the document as it's scrolled
				    "top" : window.pageYOffset + (screen.height* .8) +"px",
				    "left" : screen.width* .95 +"px",				    
	    			"width": screen.width*.07+"px",
	    			"height": screen.height*.12+"px",
	    			"cursor":"pointer",
	    			"z-index": 1032
				};				

				$scope.testResize = true;
				$scope.testInnerResize = true;

			};

			//used in our view
			$scope.chatIconSrc = "/assets/style-images/chattoggleicon0.png";
			$scope.upIconSrc = "/assets/style-images/blueUpIcon.png";

			$scope.mapChatPopBtn = {	    			    
			    "position" : "absolute",
			    //ensures icon follows the document as it's scrolled
			    "top" : window.pageYOffset + (screen.height* .65) +"px",
			    "left" : screen.width* .95 +"px",			    
			    "cursor":"pointer",
    			"width": screen.width*.07+"px",
	    		"height": screen.height*.12+"px"
			};

			$scope.loginModalStyler = {
				"z-index":5,
				"position":"absolute",
				"left" : screen.width* .35 +"px",			    
				"top" : window.pageYOffset + (screen.height* 0.08) +"px"

			};


			
			
			$scope.mapChatDiv = {
				"z-index": 1, 	    			    
			     "position" : "absolute",
			    // //ensures icon follows the document as it's scrolled
			    "top" : window.pageYOffset + (screen.height* .15) +"px",
			    "left" : screen.width* .01 +"px"			   
			};
			

			$scope.innerChatDiv = {
				"background-color":"#1e90ff",
			    "border": 6+"px solid #288ced",
			    "border-radius": 5+"px"
			};
			  	
		  		
		  });	  

	  
	};

	
	 

	this.scrollToTop = function(){
		// this.window.pageYOffset = 0;
		window.scrollTo(0,0);
	}

	this.toNewView = function(selectedView){
		if(Auth.isLoggedIn()){
			//think $rootScope and $window are reventing the redirect from behaving as hoped.

			//trying a dynamic redirect
			
			// $location.path('/forum');
			$location.path('/'+ selectedView);			
			//$location.path('/%s',selectedView);			
		} else{			

			$scope.fadeLoginModal = !$scope.fadeLoginModal;
		}
	}

	this.facebook = function() {
			
		console.log($window.location.host); //localhost:8080
		console.log($window.location.protocol); //http
		
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
		app.errorMsg = false; //removes any visible errors until we get our response back

		Auth.login(app.loginData).then(function(data){
			if(data.data.success) {
				app.loading = false;

				//if other error message set, they're disabled before success message is displayed			
				app.errorMsg = false;
				// facebook.errorMsg = false;
				// twitter.errorMsg = false;
				// google.errorMsg = false;

				app.successMsg = data.data.message + '....Redirecting....';	
				console.log('form submitted');	

				$timeout(function(){				
					$location.path('/forum');
					app.loginData = '';
					app.successMsg = false;
				}, 3000);								
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

//});
})

.directive('dragMe', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attr, ctrl) {
			
			//was hoping to make chat div fully draggable, further empowering the user

		}
	};
});

