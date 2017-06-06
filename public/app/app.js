/* going to use this main config file to inject our other angular files into this main application */

/* only injecting this one into our index (body ng-app etc..) as this module will feed/is linked to our other 
angular modules ensure to add the routes.js as a dependency */
angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','mainCtrl','authServices'])

/*.config(function(){
	console.log('testing main app config');	
//}); */

