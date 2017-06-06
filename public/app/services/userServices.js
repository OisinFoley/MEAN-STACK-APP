angular.module('userServices',[])
.factory('User', function($http){
	userFactory = {};

//we're going to create a function that can be used all throughout our application(DRY)
	userFactory.create = function(regData){
		return $http.post('/api/users', regData)
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
	