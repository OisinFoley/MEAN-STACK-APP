angular.module("userControllers",['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){

	var app = this;
	
	app.regUser = function(regData, valid){
		app.loading = true;
		app.errorMsg = false; //ensures existing message disappears fresh error scenario
					
		if(valid){
			User.create(app.regData).then(function(data){	
				if(data.data.success){
					//lost scope of 'this' in here, hence use of var app
					app.loading = false;				
									
					 //app.successMsg = data.data.message;

					//this is a test
					app.errorMsg = data.data.message;

					//just adding timeout for effect
					$timeout(function(){
						//acts as simple redirect
						$location.path('/login');
					}, 7000);								
				}
				else{
					app.loading = false;
					app.errorMsg = data.data.message;
				}
			});						
		} else {
			//error message created due to regForm.$valid's value in our registration
			app.loading = false;
			app.errorMsg = 'Please ensure form is filled out properly';
		}
	};
	
	this.checkUsername = function(regdata){
		app.checkingUsername = true; //acts as a loading like in regUser(see above)
		app.usernameMsg = false;
		app.usernameInvalid = false;

		User.checkUsername(app.regData).then(function(data){
			// console.log(data);
			if(data.data.success){
				app.checkingUsername = false;
				app.usernameInvalid = false;					
				app.usernameMsg = data.data.message;					
			} else {
				app.checkingUsername = false;
				app.usernameInvalid = true;					
				app.usernameMsg = data.data.message;					
				}
		});
	}

	this.checkEmail = function(regdata){
		app.checkingEmail = true; //acts as a loading like in regUser(see above)
		app.emailMsg = false;
		app.emailInvalid = false;

		User.checkEmail(app.regData).then(function(data){
			
			if(data.data.success){
				app.checkingEmail = false;
				app.emailInvalid = false;					
				app.emailMsg = data.data.message;					
			} else {
				app.checkingEmail = false;
				app.emailInvalid = true;					
				app.emailMsg = data.data.message;					
				}
		});
	}
})

//may explain use of anonymous controller
//https://stackoverflow.com/questions/24444686/angularjs-why-using-anonymous-controller-in-directive
//basically a name isn't required but we could provide an alias via controllerAs if we wanted child directives
.directive('match', function() {
  return {
    restrict: 'A',
    controller: function($scope) {

    	$scope.confirmed = false;

    	//to get value from $observe which is inside 'link:', we must pass the value like so
    	$scope.doConfirm = function(values){
    		
    		// ^ now view our console, each value is logged as one input is updated
    		// ^ now we can implement a common 'confirm password' scenario

    		values.forEach(function(ele){
    			//can't have these displayed to an outside user, password revealed
    			// console.log(ele);
    			// console.log($scope.confirm);

    			if($scope.confirm == ele){    				
    				$scope.confirmed = true;
    			} else {
    				$scope.confirmed = false;
    			}
    		})
    	}
    },

    //we have passed our scope to the directive,
    //we said above that we want to match an attribute, hence why we get the value back from our view's 'match='
    //link essentially links back to the anonymous controller in the directive
    link: function(scope, element, attrs) {
    	//observe our 'match' attribute we've created
    	/*	the match attr is mapped to the model value of our firstPassword, so each time 
    	we type in the firstPassword textbox, the match attr is updated. due to this observe, you'll
    	see each change logged in console
    	REMEMBER: 'match' is just a custom attribute of a textbox	*/
    	attrs.$observe('match', function(){    		
    		// can no longer write as the next line due to above use of values.foreach(){}
    		//gives a typeerror
    		//scope.doConfirm(attrs.match);

    		scope.matches = JSON.parse(attrs.match);
    		scope.doConfirm(scope.matches);
    		//could essentially write as : scope.doConfirm(JSON.parse(attrs.match));
    	})

    	scope.$watch('confirm', function(){
    		// scope.doConfirm(attrs.match);
    		scope.matches = JSON.parse(attrs.match);
    		scope.doConfirm(scope.matches);
    	})

    }    	
  };
})

//references authServices' authFactory whose facebook function calls the AuthToken factory which then tells the window to save the token
.controller('facebookCtrl', function($routeParams, Auth, $location, $window){	

	var app = this;

	//acces the token
	if($window.location.pathname == '/facebookerror') {
		app.errorMsg = 'Facebook email not found in database!';
	} else {
		console.log($routeParams.token);
		Auth.facebook($routeParams.token);	
		$location.path('/forum');
	}
})

.controller('twitterCtrl', function($routeParams, Auth, $location, $window){	

	var app = this;

	//acces the token
	if($window.location.pathname == '/twittererror') {
		app.errorMsg = 'Twitter email not found in database!';
	} else {
		console.log($routeParams.token);
		Auth.twitter($routeParams.token);	
		$location.path('/forum');
	}
})

.controller('googleCtrl', function($routeParams, Auth, $location, $window){	

	var app = this;
	
	if($window.location.pathname == '/googleerror') {
		app.errorMsg = 'Google email not found in database!';
	} else {
		console.log($routeParams.token);
		Auth.google($routeParams.token);	
		$location.path('/forum');
	}
});
	
