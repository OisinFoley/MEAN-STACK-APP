angular.module('forumServices',[])
.factory('Content', function($http){
	var forumFactory = {};

//working
	// Content.newThread
	forumFactory.newThread = function(ThreadData){
		return $http.post('/api/addthread', ThreadData);
	}

//working
	//Content.readThreads()
	forumFactory.readThreads = function(){
		console.log("IN SERVICES, BEFORE /API/READTHREADS()");					
		return $http.post('/api/readthreads');
	}

//working
	//Content.loadPosts()
	forumFactory.loadPosts = function(id){	
	console.log("content factory -> loadPosts function");	
		return $http.post('/api/loadposts', id);
	}

//working
	//Content.newComment()
	forumFactory.newComment = function(commentData){
		console.log("comment post factory");
		return $http.post('/api/writepost', commentData);
	}

//working
	// Content.registerLike(likeData)
	forumFactory.registerCommentLike = function(likeData){
		console.log("content factory: registerLike()");
		return $http.post('/api/writecommentlike', likeData);	
	}

//working
	//Content.registerThreadLike(threadLikeData)
	forumFactory.registerThreadLike = function(threadLikeData){
		return $http.post('/api/writethreadlike', threadLikeData);		
	}
	

	return forumFactory;
})