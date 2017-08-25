angular.module('imageServices',[])
.factory('Image', function($http){
	var imageFactory = {};

	//Image.addPhoto(resp.data.path)

	imageFactory.addPhoto = function(name,path){
		photoData = [{name:name,path:path}];
		return $http.post('/api/addPhoto',photoData);
	}
	// imageFactory.loadFromApi = function(imagePath){
	// 	//return $http.post('/api/users', regData)
		
	// 	//example taken from userServices,
	// 	//userServices was passed form data as strings
	// 	//now we are just passing a single string

	// 	//still need to create in api.js
	// 	return $http.post('/api/images', imagePath)
	// 	//imagePath
	// }



	console.log("inside image factory");
		return imageFactory;
});