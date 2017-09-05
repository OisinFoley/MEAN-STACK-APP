angular.module('authServices',[])

.factory('Auth', function($http, AuthToken){
	var authFactory = {};

//we're going to create a function that can be used all throughout our application(DRY)
	authFactory.login = function(loginData){
		return $http.post('/api/authenticate', loginData).then(function(data){
			console.log(data.data.token);
			AuthToken.setToken(data.data.token);
			return data;
		});
	}

	//will be called from our mainCtrl.js
	//auth.isLoggedin()
	authFactory.isLoggedIn = function(){
		//if there's a token
		if(AuthToken.getToken() ) {
			return true;
		}
		else{
			return false;
		}
	};

	// Auth.facebook()
	authFactory.facebook = function(token){
		AuthToken.setToken(token);
	}

	// Auth.twitter()
	authFactory.twitter = function(token){
		AuthToken.setToken(token);
	}

	// Auth.google()
	authFactory.google = function(token){
		AuthToken.setToken(token);
	}

	//auth.getUser()
	authFactory.getUser = function(){
		if(AuthToken.getToken()) {
			return $http.post('/api/me');
		} else {  
			//$q rejects the request, preventing an error
			$q.reject({ message: ' user has no token '});
		}



	}

	//Auth.logout();
	authFactory.logout = function(){
		AuthToken.setToken();
	};

	return authFactory;
})
/*
 This is injected into mainCtrl, as we want 
the authentication info available throughout our app, as we need to maintain the user's status as signed in
while they interact with the app 
*/

.factory('AuthToken', function($window){
	var authTokenFactory = {};	

//we're going to create a function that can be used all throughout our application(DRY)
	//AuthToken.setToken(token)
	authTokenFactory.setToken = function(token){
		if(token) {
			$window.localStorage.setItem('token', token);	
		} else {
			$window.localStorage.removeItem('token');
		}

		
	}
	//AuthToken.getToken()
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}


	return authTokenFactory;
})

//this is used to attach a token to every request, 
//otherwise our console.log always notes that we haven't provided a token
//because of this factory, we need to do some config in 'app.js'
.factory('AuthInterceptors', function(AuthToken){
	var authInterceptorsFactory = {};

	authInterceptorsFactory.request = function(config){
		var token = AuthToken.getToken();

		//if token exists, configure/tell our header that its access-token key is the object named 'token'
		if(token) config.headers['x-access-token'] = token;

		return config;
	}

	return authInterceptorsFactory;
});
	

	