angular.module('userServices',[])
.factory('User', function($http){
	var userFactory = {};

//we're going to create a function that can be used all throughout our application(DRY)
	// User.create(regData)
	userFactory.create = function(regData){
		return $http.post('/api/users', regData)
	}
	// User.checkUsername(regData)
	userFactory.checkUsername = function(regData){
		return $http.post('/api/checkusername', regData)
	}
	// User.checkEmail(regData)
	userFactory.checkEmail = function(regData){
		return $http.post('/api/checkemail', regData)
	}

	return userFactory;
})
/*
 app.js links userCtrl.js and userServices.js
 userServices does the 'post' action
 in userCtrl, we list userServices as a dependency for the module, and define 'User' as a parameter
 	for the controller's callback function

*/

//$http.post('/api/users', this.regData).then(function(data){
	