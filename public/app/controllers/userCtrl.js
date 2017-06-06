angular.module("userControllers",['userServices'])
//we won't actually have an 'ng-controller' anywhere in some HTML, routes.js will 
//tell us the controller associated with a route
.controller('regCtrl', function($http, $location, $timeout, User){
// quick reminder: 'User' is the name of the factory we're making use of

	var app = this;

	//has to be this. rather than var regUser or else it won't wire up correctly
	// var regCustomer = function(){
	// this.regUser = function(regData){
	app.regUser = function(regData){
		app.loading = true;
		app.errorMsg = false; //ensures message disappears when we have a post success scenario
		//console.log('--- form data submitted ---');
		//console.log(this.regData);		//outpout as JSON
		//because of factory we will replace the next line with the code in scope written after it.
		//$http.post('/api/users', app.regData).then(function(data){
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
	};
	//console.log('testing regCtrlx');	
});
	

// //:8080/api/users
// 	router.post('/users', function(req,res){
// first 2 params mandatory, other 2 optional. according to documentation, all params are optional https://docs.angularjs.org/api/ng/service/$timeout
//$timeout([fn], [delay], [invokeApply], [Pass]);