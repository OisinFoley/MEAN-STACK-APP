angular.module("forumControllers",['forumServices'])

.controller('forumCtrl', function($http, $location, $timeout, Content, $scope, Auth, $rootScope){

	var app = this;

	app.sendingForm = false;


	// $rootScope.$on('$routeChangeStart', function() {
		//calls the service upon initial load
		if(Auth.isLoggedIn()) {
			//console.log("SUCCESS: user is logged in");
			app.isLoggedIn = true;
			//if user is logged in, we want to get their info, this verificiation is done back in authServices.js
			Auth.getUser().then(function(data){
				 //console.log("data.data.id is %s",data.data.id);
				 app.uuid = data.data.uuid;
				app.id = data.data.id;
				app.username = data.data.username; //now accessible at front-end
				app.useremail = data.data.email; //now accessible at front-end
				//app.loadMe = true;
			});
		}
		else {
			console.log("Reminder: user is NOT logged in");
			//app.username = {};
			// app.username = false;
			app.username = ''; //neither '{}' nor 'false' work as hoped. they're literally copied.
			app.loadMe = true;
		}
		/*when we had the above if/else statement, but without the $rootscope.$on function, we would've had
		to refresh the page each time to check if user was loggin, now they update with each route/view change
		, as the code implies	*/

		//if($location.hash() == '_=_') $location.hash(null);
	//});





	app.newThread = function(ThreadData, valid){
		app.sendingForm = true;
		console.log(" sending new thread form");		
		app.errorMsg = false; //ensures message disappears when we have a post success scenario
		
		if(valid){						
			Content.newThread(app.ThreadData).then(function(data){
				if(data.data.success){
					app.successMsg = data.data.message;
					console.log("success the insert happened");
					app.sendingForm = false;
					$timeout(function(){
						//acts as simple redirect
						$location.path('/forum');
					}, 2000);								
				}
				else{
					app.sendingForm = false;
					console.log("fail no inserts happened");
					app.errorMsg = data.data.message;
				}
			});
		} else {
			//error message created due to regForm.$valid's value in our registration
			app.sendingForm = false;
			app.errorMsg = 'Please ensure title is provided';
		}	
	};

	//form submit
	app.newComment = function(CommentData, valid){
		
		app.sendingForm = true;
		app.errorMsg = false; 

		//grabbing id of the thread we're commenting on
		app.CommentData.content_uuid = $location.path().substr(8);		
		//value gathered from the above 'Auth.isLoggedIn()' callback
		app.CommentData.userid = app.id;		
		app.CommentData.user_uuid = app.uuid;		

		console.log("commentdata total is : %s",JSON.stringify(app.CommentData));
					
		if(valid){		
		//call similarly named factory function, passing the form data				
		//alert("hi");
			Content.newComment(app.CommentData).then(function(data){
				if(data.data.success){
					app.successMsg = data.data.message;		
					// not working, don't know why. also tried the controller alias of forum. and $scope
					app.sendingForm = false;
					console.log("success");
					
				}
				else{
					
					console.log("failed");
					app.sendingForm = false;
					app.errorMsg = data.data.message;
				}
			});
		} else {
			//error message created due to regForm.$valid's value in our registration
			app.sendingForm = false;
			app.errorMsg = 'Please ensure comment is provided';
		}	
	};
		
	app.readThreads = function(){
		app.loading = true;
		console.log("IN CONTROLLER, BEFORE READTHREADS()");					
		Content.readThreads().then(function(data){
				if(data.data.success){
					app.successMsg = data.data.message;
					console.log("success %s", data.data.message);					
					
					app.threads = data.data.content;

					//checking individual properties
					// console.log("DDDDDDDDDDD : %s", JSON.stringify(data.content.title));
					//console.log("DDDDDDDDDDD : %s", JSON.stringify(data.data.content[2].postCount));

				}
				else{
					//app.loading = false;
					console.log("failure");
					app.errorMsg = data.data.message;
				}			
		}); 		
	};


	app.openThread = function(thread){		
		$scope.chosenThread = thread._id;		
		//will still use this ctrl after redirect
		$location.path('/thread/'+thread.uuid);
	};

	app.registerThreadLike = function(){		
		var threadLikeData = {
			content_uuid : $location.path().substr(8),
			user_uuid : app.uuid

		};
		console.log("a %s",threadLikeData.content_uuid);
		

		Content.registerThreadLike(threadLikeData).then(function(data){
			if(data.data.success){
				app.successMsg = data.data.message;					
				console.log("success: like registered to thread");
				
			}
			else{
				
				console.log("failure:the like wasn't registered to the thread");
				app.errorMsg = data.data.message;
			}
		});
	}


	app.registerCommentLike = function(likeData){		
		//Reusing api object from 'ngrepeat: post' as it contains 2 attribues we need from the post/comment,
		//content_id(id for the thread), and contentPost_id(id for the comment, written as _id)
		//user_id is previously to the user who made the comment, but now we set the user_id to be the user 
		//who is logged in so we can register his like efficiently
			
		likeData.user_uuid = app.uuid;
		likeData.thread_uuid = $location.path().substr(8);				
		
		Content.registerCommentLike(likeData).then(function(data){
				if(data.data.success){
					app.successMsg = data.data.message;					
					console.log("success: like registered to comment");
				
				}
				else{
					//app.loading = false;
					console.log("failure:the like wasn't registered");
					app.errorMsg = data.data.message;
				}
			});
		}; 

	

	app.loadPosts = function(){
		app.loading = true;			
		console.log('Amended current route name: ' + $location.path().substr(8));
		console.log("IN CONTROLLER, BEFORE READPOSTS()");					
		var thread_id = {};

		thread_id.uuid = $location.path().substr(8);
		

		Content.loadPosts(thread_id).then(function(data){
		//Content.loadPosts($location.path().substr(8)).then(function(data){
				if(data.data.success){

					$scope.threadTitle = data.data.ourData.title;					
					console.log(JSON.stringify(data.data));					
					// console.log(JSON.stringify($scope.threadResults.PostersNames));
					
					app.posts = data.data.ourData.posts;
					app.threadFavCount = data.data.ourData.favourites.length;
					console.log(JSON.stringify(data.data.ourData[0]));
					//alert(JSON.stringify(data.data.ourData._id));
					
				}
				else{
					//app.loading = false;
					console.log("failure");
					app.errorMsg = data.data.message;
				}			
		}); 		
	};
	
});
