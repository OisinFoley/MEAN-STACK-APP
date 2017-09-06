angular.module("imageController",['ngFileUpload','imageServices','ngTagsInput'])
// angular.module("imageController",['imageServices','ngFileUpload'])
// angular.module("imageController",['imageServices','ngTagsInput'])



.controller('imageCtrl', ['Upload','$window', function(Upload, $scope, $http, $location, $timeout, Image, $window){

console.log("inside image controller");

	var app = this;


    //var app = this;
    app.submit = function(){ //function to call on form submit
        if (app.upload_form.file.$valid && app.file) { //check if from is valid
            app.upload(app.file); //call upload function
        }
    }

    app.addPhotoo = function(name,path){
        Image.addPhoto(name, path).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;                 
                console.log("success: photo added to db");
                // $timeout(function(){
                //  //acts as simple redirect
                //  $location.path('/' + $location.path());
                // }, 2000);                                
            }
            else{
                //app.loading = false;
                console.log("failure:the photo failed to upload");
                app.errorMsg = data.data.message;
            }
        });
    };
    
    app.upload = function (file) {
        Upload.upload({
            url: 'http://127.0.0.1:8080/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
               // $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
               //console.log("response obj %s",JSON.stringify(resp.config.data.file));
               console.log("response obj %s", resp.data.path);
               console.log("response name %s", resp.data.name);
               console.log("response obj %s", resp.data.path.lastIndexOf("/images/"));
               console.log("response obj %s", resp.data.path.substr(69));

               // original name
               // url

               app.addPhoto(resp.data.name, resp.data.path.substr(69));
               

            } else {
                //$window.alert('an error occured');
            }
        }, function (resp,$window) { //catch error
            console.log('Error status: ' + resp.status);
            //$window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            app.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

	// widget not populating with this data
	//app.tags = [
	$scope.tags = [
    { "name": "Brazil", flag: "http://mbenford.github.io/ngTagsInput/images/flags/Brazil.png"}, 
    { "name": "Fast Food", flag: "http://icons.iconarchive.com/icons/sonya/swarm/256/Fast-Food-icon.png" },
    { "name": "Italy", flag: "http://mbenford.github.io/ngTagsInput/images/flags/Italy.png" },
    { "name": "Love", flag: "https://cdn4.iconfinder.com/data/icons/colorful/256/red-21.png" },
    { "name": "Food", flag: "https://cdn3.iconfinder.com/data/icons/medicons-3/550/apple-health-512.png" },    
  ];



/*
    app.newImage = function(imageData){
        console.log("aaaaaaandy %s",imageData);
        console.log("aaaaaaandy^2 %s",imageData);
    }


	var imagePath = "images/GameOfThrones/got2.jpg";

	var vm = this;
    app.submit = function(){ //function to call on form submit
        if (app.upload_form.file.$valid && app.file) { //check if from is valid
            app.upload(app.file); //call upload function
        }
    };


    app.upload = function (file) {

      //alert(file);
      // var aaaa = Object.getOwnPropertyNames(file);
      // alert(Object.keys(file));
      // alert("here comes values");
      // alert(Object.values(file));
      // alert(Object.keys(file));

        Upload.upload({
            url: 'http://127.0.0.1:8080/upload', //webAPI exposed to upload the file
            data:{file:file}, //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            app.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };



	// app.loadImage = function(imagePath){

	// 	app.loading = true;

	// 	Image.loadFromApi(imagePath).then(function(data){
	// 		if(data.data.success){								
	// 				//messages set in api.js					
	// 				app.successMsg = data.data.message;										
	// 			}
	// 			else{
	// 				app.errorMsg = data.data.message;
	// 			}
	// 	});
	// }
*/
}]);