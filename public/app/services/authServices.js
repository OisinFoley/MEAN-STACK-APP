angular.module('authServices',[])

.factory('Auth', function($http){
	var authFactory = {};

//we're going to create a function that can be used all throughout our application(DRY)
	authFactory.login = function(loginData){
		return $http.post('/api/authenticate', loginData)
	}
	return authFactory;
})
/*
 This is injected into mainCtrl, as we want 
the authentication info available throughout our app, as we need to maintain the user's status as signed in
while they interact with the app 
*/

	