angular.module("userControllers",[])
//we won't actually have an 'ng-controller' anywhere in some HTML, routes.js will 
//tell us the controller associated with a route
.controller('regCtrl', function($http){

	//has to be this. rather than var regUser or else it won't wire up correctly
	// var regCustomer = function(){
	this.regUser = function(regData){
		console.log('testing new button');
		console.log('--- data submitted ---');
		console.log(this.regData);		//outpout as JSON
		$http.post('/api/users', this.regData);
	};
	//console.log('testing regCtrlx');	
});
	

// //:8080/api/users
// 	router.post('/users', function(req,res){