angular.module('feedController',['feedServices','ui.bootstrap','ngAnimate','ngSanitize'])

//might need separate controllers later for news feed, learn, etc.********************************
.controller('feedCtrl', function($http, $location, $timeout, User, Feed,Auth,$scope){
		// console.log("INSIDE feed CTRL connected");
		//second controller for typeahead maybe deserved its own module
		
var app = this;

// not required but serves as a reminder
// app.loaded=false;



		if(Auth.isLoggedIn()) {
			//console.log("SUCCESS: user is logged in");
			app.isLoggedIn = true;
			//if user is logged in, we want to get their info, this verificiation is done back in authServices.js
			Auth.getUser().then(function(data){
				 console.log("data.data is %s",JSON.stringify(data.data));
				app.id = data.data.id;
				app.uuid = data.data.uuid;
				app.username = data.data.username; //now accessible at front-end
				app.useremail = data.data.email; //now accessible at front-end
				//app.loadMe = true;
			});
		}
		else {
			console.log("Reminder: user is NOT logged in");			
			app.username = ''; //neither '{}' nor 'false' work as hoped. they're literally copied.
			app.loadMe = true;
		}


	app.registerArticleLike = function(articleData){	
	app.loading = true;	
		//Reusing api object from 'ngrepeat: post' as it contains 2 attribues we need from the post/comment,
		//content_id(id for the thread), and contentPost_id(id for the comment, written as _id)
		//user_id is previously to the user who made the comment, but now we set the user_id to be the user 
		//who is logged in so we can register his like efficiently

				
		articleData.user_uuid = app.uuid;

		// articleData.user_uuid = "8a357e7f-161c-4b56-814a-8fe08830843e";
		app.loading  = true;
		//console.log("%s",JSON.stringify(articleData));
		
		
		console.log("look up");
		
		Feed.registerArticleLike(articleData).then(function(data){
				if(data.data.success){
					app.likeResponseMsg = data.data.message;

					app.loading = false;				
					console.log("success: article 'like' regsitered to db ");					
				}
				else{
					
					app.loading = false;
					console.log("failed registering article 'like' ");
					app.likeResponseMsg = data.data.message;
				}
		});
	}; 


	app.newComment = function(article, CommentData, valid){
		app.loading = true;
		//empty any existing error message until we return
		app.commentResponseMsg = false; 
		
		console.log("article is %s", JSON.stringify(article));
		console.log("commentdata is %s", JSON.stringify(app.CommentData));

		article.postText = app.CommentData.postText;
		article.user_uuid = app.uuid;

		//app.article.user_uuid = app.uuid;
		console.log("CHECKING THEIR UUID : %s", app.uuid);

		//having a CORS issue when logged in so have hardcoded a user's uuid
		//article.user_uuid = "8a357e7f-161c-4b56-814a-8fe08830843e";
		
	
		if(valid){						
			Feed.newComment(article).then(function(data){
				if(data.data.success){
					app.commentResponseMsg = data.data.message;
					console.log("success: comment posted to article");
					app.loading = false;
										
				}
				else{
					//app.loading = false;
					console.log("error");
					app.loading = false;
					app.commentResponseMsg = data.data.message;
				}
			});
		} else {
			//error message created due to regForm.$valid's value in our registration
			//app.loading = false;
			app.errorMsg = 'Please ensure title is provided';
		}	
	}		



	$scope.loadFeedItems = function($scope){		

			var w = window.innerWidth;
			var h = window.innerHeight;

			var limit = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight;
			console.log("the limit is %s", limit);
			var limit2 = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
			console.log("the limit2 is %s", limit2);

			$http({
				method: 'GET',
				 url: 'https://newsapi.org/v1/articles?source=entertainment-weekly&sortBy=top&apiKey=dbfc3f956d3d4b5caac1017cc5e18a9d'

				// url: 'https://newsapi.org/v1/articles?source=entertainment-weekly&sortBy=top&apiKey=dbfc3f956d3d4b5caac1017cc5e18a9d',
				// withCredentials: true,
		  //       headers: {
		  //                   'Content-Type': 'application/json; charset=utf-8',
		  //                   'Access-Control-Allow-Credentials' : true
		  //       }			
			}).then(function successCallback(response) {
													
				app.myfeeditems = response.data.articles;			
				console.log("API call succeeded");
					      		
				//now load view's contents
	      		app.loaded=true;     		

				}, function errorCallback(response) {					
					console.log("FAILED TO LOAD");
					app.errorMsg = "API call failed, can't populate feed at this time.";
				});	
		}

			$scope.filmSearchStyle = {
				"width": 750+"px",	
				"margin":"auto",
				"text-align": "center",
				"background": "#FFF",
				"opacity": 0.95,
				"padding": 40+"px" + 10+"px",
				"border": 1+"px solid #CCC",
				"box-shadow": 0+"px" + 0+"px" + 15+"px #CCC",
				"margin-top": 4+"px"
			};
})


// /was hoping to implement fancy modal, just didn't have time

// .controller('ModalInstanceCtrl', function($scope, $uibModalInstance, modalFactory) {

//   //$scope.searchTerm = term;

//   $scope.ok = function() {
//     modalFactory.open('lg', 'result.html', {searchTerm: $scope.searchTerm});
//     //$uibModalInstance.close($scope.searchTerm);
//   };

//   $scope.cancel = function() {
//     $uibModalInstance.dismiss('cancel');
//   };
// })

// .controller('ModalResultInstanceCtrl', function($scope, $uibModalInstance, params) {

//   $scope.searchTerm = params.searchTerm;

//   $scope.ok = function() {
//     $uibModalInstance.close($scope.searchTerm);
//   };

//   $scope.cancel = function() {
//     $uibModalInstance.dismiss('cancel');
//   };
// })

// this works, we just need to adjust
.component('myContent', {
    template: 'I am content! <button type="button" class="btn btn-default" ng-click="$ctrl.open()">Open Modal</button>',
    controller: function($uibModal) {
      $ctrl = this;
      $ctrl.dataForModal = {
        name: 'NameToEdit',
        value: 'ValueToEdit'
      }
      $ctrl.open = function() {
        $uibModal.open({
          component: "myModal",
          resolve: {
            modalData: function() {
              return $ctrl.dataForModal;
            }
          }
        }).result.then(function(result) {
          console.info("I was closed, so do what I need to do myContent's controller now.  Result was->");
          console.info(result);
        }, function(reason) {
          console.info("I was dimissed, so do what I need to do myContent's controller now.  Reason was->" + reason);
        });
      };
    }
  })

.component('myModal', {    
    template:`
    <uib-tabset active="active">
    <uib-tab index="0" >
		<uib-tab-heading>
		    <i class="fa fa-info-circle" aria-hidden="true"></i> Film / Show info
		</uib-tab-heading>
    </uib-tab>
    
    <uib-tab index="0" heading="Person(s)">
    	<uib-tab-heading>
    		<i class="fa fa-address-card-o" aria-hidden="true"></i> Actors
		</uib-tab-heading>
    </uib-tab>



    <uib-tab index="0" heading="Gallery">
    	<uib-tab-heading>
    		<i class="fa fa-picture-o" aria-hidden="true"></i>Gallery
		</uib-tab-heading>
		<div style="background:blue;height:340px;width:640px;">
		dddddddddddd {{app.testvalue}}

		<div ng-hide="list == undefined">
		dddddddd
      <div ng-repeat="item in movieInfo">       
        score: {{item.vote_average}}<br>
        title: {{item.original_title}}<br>
        overview: {{item.overview}}<br>
        released: {{item.release_date}}<br>
        language: {{item.original_language}}
        
        <!-- round corenrs not working -->         
        <image style="margin-top:60px;height:50px"  ng-class='img img-rounded img-responsive ' ng-src="https://image.tmdb.org/t/p/w500{{item.poster_path}}"></image>
      </div>

   </div> </div>
    </uib-tab>

    
    <uib-tab index="3" select="alertMe()">
      <uib-tab-heading>
      
<uib-tab-heading>
    <i class="glyphicon glyphicon-bell"></i> Alert!
</uib-tab-heading>

      </uib-tab-heading>
      I've got an HTMjjjjjL heading, and a select callback. Pretty cool!
      <br>
      ssssheee
      {{$scope.chicken.name}}
    </uib-tab>
  	</uib-tabset>`,
    bindings: {
      modalInstance: "<",
      resolve: "<"
    },
    controller: [function() {
      var $ctrl = this;

      $ctrl.$init = function() {
        $ctrl.modalData = $ctrl.resolve.modalData;
      }

      $ctrl.handleClose = function() {
        console.info("in handle close");
        // $ctrl.modalInstance.close($ctrl.modalData);
        $ctrl.modalInstance.close();

      };

      $ctrl.handleDismiss = function() {
        console.info("in handle dismiss");
        $ctrl.modalInstance.dismiss("cancel");
      };
    }]
  })

// .controller('TypeAheadController', ['$scope','$uibModal', function($scope, $rootScope, $log, dataFactory, $uibModalInstance, $uibModal){
.controller('TypeAheadController', function($scope, $uibModal, dataFactory, $window){


var app = this;



$scope.tabs = [
    { title:'Dynamic Title 1', content:'Dysssssssssssnamic content 1' },
    { title:'Dynamic Title 2', content:'Dynammmmmmm	ic content 2', disabled: true }
  ];

  $scope.model = {
    name: 'Tabs'
  };

$scope.open = function() {
        $uibModal.open({
          component: "myModal",
          resolve: {
            modalData: function() {
              return $ctrl.dataForModal;
            }
          }
        }).result.then(function(result) {
          console.info("I was closed, so do what I need to do myContent's controller now.  Result was->");
          console.info(result);
        }, function(reason) {
          console.info("I was dimissed, so do what I need to do myContent's controller now.  Reason was->" + reason);
        });
      };

	
	//dataFactory.get('https://api.themoviedb.org/3/search/tv?api_key=3e4b0881fb23c07be0badb10987148ad&query=family+gu').then(function(data){
	dataFactory.get('https://api.themoviedb.org/3/search/movie?api_key=3e4b0881fb23c07be0badb10987148ad&query='+ $scope.searchValue +'&append_to_response=credits').then(function(data){
		$scope.items=data.results;		
	});
	
	$scope.$watch('name', function(newVal, oldVal){
	    console.log("Search was changed to:"+newVal);
	    $scope.searchValue = newVal;
	    dataFactory.get('https://api.themoviedb.org/3/search/movie?api_key=3e4b0881fb23c07be0badb10987148ad&query='+ $scope.searchValue  +'&append_to_response=credits').then(function(data){
	  		$scope.items=data.results;
	  		//console.log("YOOOO , %s",JSON.stringify(data.results.id));
	  		dataFactory.get('https://api.themoviedb.org/3/movie/672/credits?api_key=3e4b0881fb23c07be0badb10987148ad').then(function(data){

	  			$scope.castList = data.cast;
	  			console.log("cast list is : %s",JSON.stringify($scope.castList));
	  			console.log("cast list is : %s",$scope.castList[0].character);
	  		 		console.log("inner log");	  			
	  		 		console.log("inner log %s", JSON.stringify(data.cast));
	  		 		data.cast.forEach(function(castMember){
	  		 			console.log(castMember.character);
	  		 		});
	  		});
	  	});
  	});

  	$scope.getFilmography = function(id){
  		//alert(id);
		dataFactory.get('http://api.themoviedb.org/3/discover/movie?with_cast='+id+'&sort_by=release_date.asc&api_key=3e4b0881fb23c07be0badb10987148ad').then(function(data){
			console.log("filmography data is,: %s", JSON.stringify(data));
			$scope.filmography = data.results;
		});
  	}
	
	
	$scope.openModal= function(itemToSearch){
		//alert(itemToSearch);

		dataFactory.get('https://api.themoviedb.org/3/search/movie?api_key=3e4b0881fb23c07be0badb10987148ad&query='+ $scope.searchValue +'&append_to_response=credits').then(function(data){

		// dataFactory.get('https://api.themoviedb.org/3/search/movie?api_key=3e4b0881fb23c07be0badb10987148ad&query='+ itemToSearch +'&append_to_response=credits').then(function(data){
			alert(JSON.stringify(data));

			$scope.movieInfo = data.results;
			console.log(JSON.stringify(data));
			//console.log(data[0].id);
		
			//https://api.themoviedb.org/3/movie/'+data.id+?'api_key=3e4b0881fb23c07be0badb10987148ad&append_to_response=credits
			//                  https://api.themoviedb.org/3/movie/672/credits?api_key=3e4b0881fb23c07be0badb10987148ad
			// dataFactory.get('https://api.themoviedb.org/3/movie/672/credits?api_key=3e4b0881fb23c07be0badb10987148ad').then(function(data){
			// 	console.log("HELLOTHERE : %s",JSON.stringify(data));
			// 	// $scope.actorList = data.credits.cast;
			// 	// console.log("result is %s", data);
			// 	// console.log("result is %s", data.credits);
			// 	// console.log("result is %s", data.credits.cast);
			// });

	  		$scope.items=data;
  		});
	}

	$scope.moo = function(id){
		alert("hi");
		dataFactory.get('https://api.themoviedb.org/3/movie/{672}/credits?api_key=3e4b0881fb23c07be0badb10987148ad').then(function(data){
				//console.log("HELLOTHERE : %s",JSON.stringify(data.data));
				console.log(data);
				// $scope.actorList = data.credits.cast;
				// console.log("result is %s", data);
				// console.log("result is %s", data.credits);
				// console.log("result is %s", data.credits.cast);
		});
	}

	$scope.name="";
	$scope.onItemSelected=function(){
		console.log('selected='+$scope.name);		

			$scope.openModal($scope.name);
			$scope.list = {};
			//alert($scope.list.length);
			//alert(angular.equals($scope.list, {})); 
			//alert($scope.list == undefined); 
		//$scope.openModal($scope.name);		
	}

	

// }])
})

.directive('typeahead', function($timeout) {
  return {
    restrict: 'AEC',
    scope: {
		items: '=',
		prompt:'@',
		title: '@',
		subtitle:'@',
		model: '=',
		onSelect:'&',
		onChange:'&'
	},
	link:function(scope,elem,attrs){

	   scope.handleSelection=function(selectedItem){
		 scope.model=selectedItem;
		 scope.current=0;
		 scope.selected=true;        
		 $timeout(function(){
			 scope.onSelect();
		  },200);
	  };
	  scope.current=0;
	  scope.selected=true;
	  scope.isCurrent=function(index){
		 return scope.current==index;
	  };
	  scope.setCurrent=function(index){
		 scope.current=index;
	  };
	},
	
    templateUrl: 'templateurl.html'
  }
})

// .factory('modalFactory', function($uibModal) {
//     return {
//       open: function(size, template, params) {
//         return $uibModal.open({
//           animation: true,
//           templateUrl: template || 'myModalContent.html',
//           controller: 'ModalResultInstanceCtrl',
//           size: size,
//           resolve: {
//             params: function() {
//               return params;
//             }
//           }
//         });
//       }
//     };
//  })

.factory('dataFactory', function($http) {
  return {
    get: function(url) {
      return $http.get(url).then(function(resp) {        
        
        return resp.data;
      });
    }
  };
});
