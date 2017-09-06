// console.log("feed services connected");
angular.module('feedServices',[])
.factory('Feed', function($http){

	var feedFactory = {};

	//Feed.registerArticleLike
	feedFactory.registerArticleLike = function(dbParams){
		return $http.post('/api/writearticlelike', dbParams);		
	}

	feedFactory.newComment = function(commentData){
		console.log("comment post factory");
		return $http.post('/api/writeArticleComment', commentData);
	}

//we're going to create a function that can be used all throughout our application(DRY)
	// Feed.loadAPI(apiString)

/*
	feedFactory.loadAPI = function(){	
		alert("hi");
		$http({
			method: 'GET',
			url: 'https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=dbfc3f956d3d4b5caac1017cc5e18a9d'
			//url: 'https://www.omdbapi.com/?s=saw'
			//url: 'https://www.omdbapi.com/?t=up'
		}).then(function successCallback(response) {
			//s in url is search, rather than hardcoded title, which is t		
			//console.log("stringified data Is :: %s", JSON.stringify(response.data.Search));
			//$scope.movieList = response.data.Search;
			console.log("API call succeeded");							
			//$scope.myWelcome = response.data;
      		//$scope.craic = response.data.source;
      		console.log(response.data);
      		feedFactory = response.data;

			}, function errorCallback(response) {
				console.log("API call failed");							
		});
	};

	// feedFactory.loadAPI(apiString) = function(){
	// 	return $http.get('/api/users', regData)
	// }
	
*/
	return feedFactory;

// do some work in here to gather api info

})