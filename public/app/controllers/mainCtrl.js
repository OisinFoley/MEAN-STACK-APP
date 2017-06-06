console.log('testing main Ctrl');

angular.module('mainCtrl',['authServices'])

.controller('mainCtrl',function(Auth, $location, $timeout){

	var app = this;
	this.doLogin = function(loginData){	
		app.loading = true;
		app.errorMsg = false; //ensures message disappears when we have a post success scenario

		Auth.login(app.loginData).then(function(data){
			if(data.data.success) {
				app.loading = false;								
				app.successMsg = data.data.message + '....Redirecting....';	
				console.log('form submitted');	

				$timeout(function(){				
					$location.path('/about');
				}, 2000);								
			}
			else{
				app.loading = false;
				app.errorMsg = data.data.message;
			}
		});
	};
});
