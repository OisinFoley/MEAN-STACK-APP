angular.module('emailController', ['userServices'])

	.controller('emailCtrl', function($routeParams, User){

		// console.log($routeParams.token);
		app = this; 

		//back in schema, need to set a property of password to 'select:false' because the app tries to 
		//check the password when we click the link from the email
		User.activateAccount($routeParams.token).then(function(data){
			console.log(data);
			//need to clear values each time page loads before resetting in case of error
			app.successMsg = false;
			app.errorMsg = false;


			if(data.data.success){
				app.successMsg = data.data.message;
			} else {
				app.errorMsg = data.data.message;
			}
		});

	})