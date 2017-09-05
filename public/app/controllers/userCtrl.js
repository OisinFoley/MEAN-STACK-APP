angular.module("userControllers",['userServices'])
//we won't actually have an 'ng-controller' anywhere in some HTML, routes.js will 
//tell us the controller associated with a route
.controller('regCtrl', function($http, $location, $timeout, User){
// quick reminder: 'User' is the name of the factory we're making use of

	var app = this;

	//has to be this. rather than var regUser or else it won't wire up correctly
	// var regCustomer = function(){
	// this.regUser = function(regData){
	app.regUser = function(regData, valid){
		app.loading = true;
		app.errorMsg = false; //ensures message disappears when we have a post success scenario
		//console.log('--- form data submitted ---');
		//console.log(this.regData);		//outpout as JSON
		//because of factory we will replace the next line with the code in scope written after it.
		//$http.post('/api/users', app.regData).then(function(data){
		if(valid){
			User.create(app.regData).then(function(data){
			//console.log(data);
			//console.log("data.success value is : " + data.data.success);
			//console.log("data.message value is : " + data.data.message);
				if(data.data.success){
					app.loading = false;				
					//we can't use this in here because the if clause is inside a deeper scope, meaning we lose the 
					//use of this.
					//instead we will create our 'app' var above, and change previously existing instances of 'this',
					//to our new 'app'. anywhere we see app, was formerly 'this', and would work fine only for we 
					//decided we needed this message for the client
					app.successMsg = data.data.message;
					//just adding timeout for effect
					$timeout(function(){
						//acts as simple redirect
						$location.path('/');
					}, 2000);								
				}
				else{
					app.loading = false;
					app.errorMsg = data.data.message;
				}
			});
			//can't touch backend until such time as the form is valid
			//if valid we would then do router.post in api.js(called from User.create)
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
			// console.log(data);
			// writing check rather than checking inside the conditional lost is time, be vigilant
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
    		// console.log(values);
    		// console.log($scope.confirm);
    		// ^ now view our console, each value is logged as one input is updated
    		// ^ now we can implement a common 'confirm password' scenario

    		values.forEach(function(ele){
    			console.log(ele);
    			console.log($scope.confirm);

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
		$location.path('/');
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
		$location.path('/');
	}
})

.controller('googleCtrl', function($routeParams, Auth, $location, $window){	

	var app = this;
	
	if($window.location.pathname == '/googleerror') {
		app.errorMsg = 'Google email not found in database!';
	} else {
		console.log($routeParams.token);
		Auth.google($routeParams.token);	
		$location.path('/');
	}
});
	

// //:8080/api/users
// 	router.post('/users', function(req,res){
// first 2 params mandatory, other 2 optional. according to documentation, all params are optional https://docs.angularjs.org/api/ng/service/$timeout
//$timeout([fn], [delay], [invokeApply], [Pass]);