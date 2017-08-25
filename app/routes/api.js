var User  		   = require('../models/user');
var Content  	   = require('../models/content');
var ContentPost    = require('../models/contentPost');
var UserPostLike    = require('../models/userPostLike');
var UserPostLikeNew    = require('../models/userPostLikeNew');
var UserContentLike    = require('../models/userContentLike');
var UserContentLikeNew    = require('../models/userContentLikeNew');
var ContentNew    = require('../models/contentNew');
var ContentPostNew    = require('../models/contentPostNew');

var Photo    = require('../models/photo');
var jwt 	   	   = require('jsonwebtoken');
var secret	       = 'harrypotter';
var multer = require('multer');

module.exports = function(router,app,uuid){

	router.post('/addPhoto',function(req,res){
		var d = new Date();
		var currentTimeDate = d.toLocaleString();	

		var photo = new Photo();
		// photo.description = req.body.userid;
		// photo.content_id = req.body.contentid;
		// photo.dateAdded = currentTimeDate;	
		console.log(req.body.name);
		console.log(req.body.userid.photoData.name);


	});

	router.post('/writeArticleComment',function(req,res){
		var d = new Date();
		var currentTimeDate = d.toLocaleString();	
		
		// console.log("abc: %s", req.body.user_uuid);
		// console.log("abc: %s", req.body.url);
		// console.log("abc: %s", req.body.title);

		
					ContentNew.update(								
						{ "title": req.body.title, "url": req.body.url },						
						{  $push:  
							{   posts: 
								{   
								$each:[{						
										uuid : uuid.v4(),
										user_uuid :req.body.user_uuid,    							

										postText: req.body.postText,    							
										dateAdded: currentTimeDate
									}]
									
								}   
							}  
						},{ upsert : true },
						function(err, result) {
						    if (err){
						    	res.json({	success:false, message:'Error adding comment, try again or come back later.'	});
						    	console.log("SOME ERROR OCCURRED");
						    }
						    else{						    	
						    	res.json({	success:true, message:'Comment added!'	});
						    	console.log("seems to have worked");
						    }			   
						});

	});

	router.post('/writearticlelike', function(req,res){
		var d = new Date();
		var currentTimeDate = d.toLocaleString();	

		var content  = new ContentNew();
		content.uuid = uuid.v4();
		content.title = req.body.title;
		content.url = req.body.url;
		content.isThread = false;
		content.dateAdded 	  = currentTimeDate;	
		content.dateModified 	  = currentTimeDate;
		content.favourites = {
			uuid : req.body.user_uuid,
			user_uuid :req.body.user_uuid,    							
			dateAdded: currentTimeDate
		};		
		// console.log("useruuis %s",req.body.user_uuid);
		// console.log("title %s",req.body.url);
		
		
		if(req.body.title == null ) {			
			res.json({	success:false, message:'ensure thread title was provided'	});
		} else {	


			ContentNew.find({ "title" : req.body.title, "favourites.user_uuid" : req.body.user_uuid  }).select('favourites.user_uuid').exec(function(err, returnedPosts){

				if(returnedPosts.length ==0){
					ContentNew.update(		
						
						{ "title": req.body.title },						
						{  $push:  
							{   favourites: 
								{   
								$each:[{						
										"user_uuid" :req.body.user_uuid,    							
										"dateAdded": currentTimeDate
									}]
									
								}   
							}  
						},function(err, result) {
						    if (err){
						    	res.json({	success:false, message:'Error adding like, try again!'	});
						    	console.log("SOME ERROR OCCURRED");
						    }
						    else{						    	
						    	res.json({	success:true, message:'Like added'	});
						    	console.log("seems to have worked");
						    }			   
						});
				}
		 	});				
		}
	});
	

	router.post('/writethreadlike', function(req,res){
		var d = new Date();
		var currentTimeDate = d.toLocaleString();		

		// var userContentLike = new UserContentLike();
		// userContentLike.user_id = req.body.user_id;		
		// userContentLike.content_id = req.body.content_id;
		// userContentLike.dateAdded = currentTimeDate;		

		console.log(req.body.content_uuid);
		console.log(req.body.user_uuid);

		if(req.body.content_uuid == null || req.body.content_uuid == '') {					
		 	res.json({	success:false, message:'ensure all like parameters were provided'	});
		 } else {	


		 	ContentNew.save(
			// { _id: objid  }, 			
			//{ _id: ObjectId("5996be834ce6131cc597c91e")  }, 						
			{ uuid: req.body.content_uuid  }, 									
			//{ title: "Newthre Adtitle"  }, 
			{  $push:  
				{   favourites: 
					{   
					$each:[{
						//need to create _id here or else I have to provide all these params
						//when trying to register a like.
						//not clean because if duplicate posts texts exist, then

							uuid : uuid.v4(),
							user_uuid :req.body.user_uuid,    							
							dateAdded: currentTimeDate
						}]
						
					}   
				}  
			},function(err, result) {
			    if (err){
			    	console.log("SOME ERROR OCCURRED");
			    }
			    else{
			    	console.log("seems to have worked");
			    }			   
			});
			//
			//have tried deleting all inner clauses and just goin for straight for the .save(), but same 500 error
			// userContentLike.save(function(err){
			// //console.log("entered comment save function");				
			// 	if (err) { //check validation, then duplication, otherwise send the json response
			// 		if(err.errors != null ){
			// 			//res.json({	success:false, message:'username or email already exists'	});
			// 			if(err.errors.content_uuid) {
			// 				//console.log(err.errors._id);
			// 				//res.json({	success:false, message: err.errors._id.message	}); 	
			// 			} 
			// 		} else if (err) {
			// 			//inside we will check which type of duplication has occurred
			// 			if(err.code == 11000){														
			// 				//long message, simple check allows for dynamic message							
			// 				/* was gigivng an error, so gone with less specific error output
			// 				if(err.errmsg[61] == "u"){
			// 					res.json({	success:false, message: 'Username already taken'	});
			// 				} else if(err.errmsg[61] == "e"){
			// 					res.json({	success:false, message: 'Email already taken'	});
			// 				}
			// 				*/	

			// 				res.json({ success: false, message: 'Thread like already registered for this thread.' }); 
			// 			} else{
			// 				res.json({	success:false, message: err	}); 		
			// 			}					
			// 		}
			// 	} else {					
			// 		res.json({	success:true, message:'like added'	});					
			// 	}									
			// });
		}
	});

	//handles thread likes & article comment likes
	router.post('/writecommentlike', function(req,res){

		var d = new Date();
		var currentTimeDate = d.toLocaleString();			

		console.log("aaa comment uuid : %s",req.body.uuid); 		
		console.log("aaa user's uuid : %s",req.body.user_uuid); 
		console.log("aaa thread's uuid : %s",req.body.thread_uuid);

		

		//check if like already exists for user. whole thread document returned if like already exists		
		 if(req.body.uuid == null || req.body.uuid == '') {					
		 	res.json({	success:false, message:'ensure all like parameters were provided'	});
		 } else {	

		 	ContentNew.find({ "uuid" : req.body.thread_uuid, "posts.uuid" : req.body.uuid, "posts.likes.user_uuid": req.body.user_uuid  }).select('likes.user_uuid').exec(function(err, returnedPosts){

				if(returnedPosts.length ==0){
					ContentNew.update(		
						
						{ "uuid": req.body.thread_uuid, "posts.uuid": req.body.uuid},						
						{  $push:  
							{   "posts.$.likes": 
								{   
								$each:[{						
										"user_uuid" :req.body.user_uuid,    							
										"dateAdded": currentTimeDate
									}]
									
								}   
							}  
						},function(err, result) {
						    if (err){

						    	console.log("SOME ERROR OCCURRED");
						    }
						    else{						    	
						    	console.log("seems to have worked");
						    }			   
						});
				}
		 	});
		}
	});

	//hanles writing of thread comment & article comments 
	router.post('/writepost', function(req,res){

		var d = new Date();
		var currentTimeDate = d.toLocaleString();

		
		// var contentPostNew = new ContentPostNew();
		// // contentPostNew.content_id = req.body.contentid;
		// contentPostNew.user_id = req.body.userid;
		// contentPostNew.postText = req.body.postText;
		// contentPostNew.dateAdded = currentTimeDate;		
			
		// var contentPost = new ContentPost();
		// contentPost.content_id = req.body.contentid;
		// contentPost.user_id = req.body.userid;
		// contentPost.postText = req.body.postText;
		// contentPost.dateAdded = currentTimeDate;		


		var contentNew = new ContentNew();
		//content_id = req.body.contentid;
		

		console.log("ham");

		if(req.body.postText == null ) {			
			res.json({	success:false, message:'ensure comment message was provided'	});
		} else {	
			
				console.log("IM IN HERE");

			
			//this works, just commenting out temporarily
			// ContentNew.update({title:'Newthre Adtitle'},{$set:{isThread:true}}, function(err, result) {
			//     if (err){
			//     	console.log("SOME ERROR OCCURRED");
			//     }
			//     //do something.
			//     else{
			//     	console.log("I SEEM TO HAVE COMPLETE");	
			//     }
			// });	

			// works in shell
			//db.contentnews.update({ _id: ObjectId("5996b9af9628d916f7219197")  }, {  $push:  {    posts: {   user_id :"5996bdhf96287736f7219197",    postText: "yes lawd",    dateAdded: ISODate("2017-08-18T09:57:14Z")   }   }  })

			 
			console.log(req.body.user_uuid);
			console.log(req.body.contentid);
			console.log(req.body.userid);
			console.log(req.body.userid);
			console.log(req.body.userid);
			
			ContentNew.update(
						
			{ uuid: req.body.content_uuid  }, 									
			//{ title: "Newthre Adtitle"  }, 
			{  $push:  
				{   posts: 
					{   
					$each:[{			
							uuid : uuid.v4(),
							user_uuid :req.body.user_uuid,    							

							postText: req.body.postText,    							
							dateAdded: currentTimeDate
						}]
						
					}   
				}  
			},function(err, result) {
			    if (err){
			    	console.log("SOME ERROR OCCURRED");
			    }
			    else{
			    	console.log("seems to have worked");
			    }			   
			});
		}
	});
	

	router.post('/addthread', function(req,res,weather){	

		var d = new Date();
		var currentTimeDate = d.toLocaleString();

		//update to new schema, content itself working
		var content  = new ContentNew();
		content.uuid = uuid.v4();
		content.title = req.body.title;
		content.isThread = true;
		content.dateAdded 	  = currentTimeDate;	
		content.dateModified 	  = currentTimeDate;		
		


		// var content  = new Content();
		// content.title = req.body.title;
		// content.isThread = true;
		// content.dateAdded 	  = currentTimeDate;	
		// content.dateModified 	  = currentTimeDate;
		if(req.body.title == null ) {			
			res.json({	success:false, message:'ensure thread was provided'	});
		} else {	
			content.save(function(err){
				if (err) { //check validation, then duplication, otherwise send the json response
					if(err.errors != null ){
						//res.json({	success:false, message:'username or email already exists'	});
						if(err.errors.title) {
							console.log(err.errors.title);
							res.json({	success:false, message: err.errors.title.message	}); 	
						} 
					} else if (err) {
						//inside we will check which type of duplication has occurred
						if(err.code == 11000){														
							//long message, simple check allows for dynamic message							
							/* was gigivng an error, so gone with less specific error output
							if(err.errmsg[61] == "u"){
								res.json({	success:false, message: 'Username already taken'	});
							} else if(err.errmsg[61] == "e"){
								res.json({	success:false, message: 'Email already taken'	});
							}
							*/	

							res.json({ success: false, message: 'Thread title already exists' }); 
						} else{
							res.json({	success:false, message: err	}); 		
						}					
					}
				} else {					
					res.json({	success:true, message:'thread created'	});					
				}									
			});
		}

	});


	// :8080/api/users
	/*	 USER REGISTRATION	*/
	router.post('/users', function(req,res){		
		var user = new User();		
		user.uuid = uuid.v4();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email 	  = req.body.email;
		user.name 	  = req.body.name;	
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == '') {			
			res.json({	success:false, message:'ensure uname, pword and email were provided'	});
		} else {
			user.save(function(err){
				if (err) { //check validation, then duplication, otherwise send the json response
					if(err.errors != null ){
						//res.json({	success:false, message:'username or email already exists'	});
						if(err.errors.name) {
							console.log(err.errors.name);
							res.json({	success:false, message: err.errors.name.message	}); 	
						} else if(err.errors.email) {						
							res.json({	success:false, message: err.errors.email.message	}); 	
						} else if(err.errors.username) {						
							res.json({	success:false, message: err.errors.username.message	}); 	
						} else if(err.errors.password) {						
							res.json({	success:false, message: err.errors.password.message	}); 	
							//if err not validation-related, could be duplicate user
						} else{
							res.json({	success:false, message: err	}); 	
						} //note we're checking for err.errors THEN simply just err
					} else if (err) {
						//signifies duplicate record
						if(err.code == 11000){														
							//long message, simple check allows for dynamic message							
							/* was gigivng an error, so gone with less specific error output
							if(err.errmsg[61] == "u"){
								res.json({	success:false, message: 'Username already taken'	});
							} else if(err.errmsg[61] == "e"){
								res.json({	success:false, message: 'Email already taken'	});
							}
							*/	

							res.json({ success: false, message: 'Username or E-mail already taken' }); 
						} else{
							res.json({	success:false, message: err	}); 		
						}					
					}
				} else {					
					res.json({	success:true, message:'User registered to Database'	});					
				}									
			});
		}	
	});	


	//loaded onto /forum 
	router.post('/readthreads', function(req,res){	
		 // Content.find({ isThread : true }).select(' _id title dateModified dateAdded').exec(function(err, content){
		ContentNew.find({}).select(' _id uuid title dateModified dateAdded posts').exec(function(err, contentnew){

			if(err) throw err;

			try{
				contentnew.forEach(function(thread,index){
					thread.postCount  = thread.posts.length;
				});	

				res.json({ success:true, message: "We found forum data", content:contentnew});
			} catch(err){
				console.log("Threads list empty or else see following error ...");
				console.log("There was the following error : %s", err);
			}


			

			 
		});
	});

	//loaded onto path /thread/_id 
	router.post('/loadposts', function(req,res){	
			
		//we need to do a join to et user.name too****

		ContentNew.find({ uuid : req.body.uuid  }).select('posts title favourites').exec(function(err, contentnewposts){

			if(err) throw err;
			
			var postuuid = uuid.v4();
			// console.log("your uuid is: $s",postuuid);
			// console.log("contentposts output : %s", contentnewposts);
			//console.log("favourites here hopefully : %s",contentnewposts);
		   
			
			 //after reading the threads list a few lines above, we now match each comment's user_id back to the user collection
			ContentNew.aggregate(
			    {$match: {uuid: req.body.uuid}},
			    {$unwind:"$posts"},
			    {$lookup: {
			        from: 'users', 
			        localField: 'posts.user_uuid', 
			        foreignField: 'uuid', 
			        as: 'userInfo'}},
			        function(err,data){
					     if(err){
					        res.json({status:"error"});
					        console.log("errorrr %s",JSON.stringify(data));
					        throw err;
					        // console.log("Could not find user's name");
					    }else{ 
					    	// console.log("HELLLLLLO : $s", data[0].title);
					    	 //console.log("HELLLLLLO : $s", data);
					    	// console.log("HELLLLLLO : $s", data[4].userInfo[0]);
					    	// console.log("contentposts output : %s", contentnewposts);

					    	console.log("abc %s",JSON.stringify(data));

					    	try{
						    	var usersNames = [];
						    	for(var iou=0;iou<data.length;iou++){
						    		//usersNames.push(data[iou].userInfo[0].name);
						    		contentnewposts[0].posts[iou].name = data[iou].userInfo[0].name;
						    	}
					    	} catch(err) {
					    		console.log("Couldn't assign names to post, perhaps this thread is empty!");
					    	}
					    	
					    	
						    	
					    	
					    		console.log("Couldn't assign names to post, perhaps this thread is empty!");
					    	




					    	// res.json({ success:true, message: "We found posts", ourData:contentnewposts[0], namesList: usersNames});
					    	res.json({ success:true, message: "We found posts", ourData:contentnewposts[0] });

					    }
					}
			);			
		});
	});
	

	
	router.post('/checkusername',function(req,res){
		//res.send('testing authenticate route');
		User.findOne({ username: req.body.username}).select('username').exec(function(err, user){
			if(err) throw err;

			if(user) { 
				res.json({ success:false, message: 'That username is already taken'});
			} else {
				res.json({ success:false, message: 'Valid username'	})			
			}
		});
	});

	router.post('/checkemail',function(req,res){
		//res.send('testing authenticate route');
		User.findOne({ email: req.body.email}).select('email').exec(function(err, user){
			if(err) throw err;

			if(user) { 
				res.json({ success:false, message: 'That email is already taken'});
			} else {
				res.json({ success:false, message: 'Valid email' })			
			}
		});
	});

	//USER LOGIN ROUTE
	//:port/api/authenticate
	router.post('/authenticate',function(req,res){
		console.log("authenticate");
		//res.send('testing authenticate route');
		User.findOne({ username: req.body.username}).select('email uuid _id username password').exec(function(err, user){
			if(err) throw err;

			if(!user) { //if user does not exist
				res.json({ success:false, message: 'could not authenticate user'});
			}
			else if(user) {
				if(req.body.password) { //if a value is provided
					var validPassword = user.comparePassword(req.body.password);
				}
				else {
					res.json({ success:false, message: 'no password provided'})
				}
				if(!validPassword) {
					res.json({ success:false, message: 'could not authenticate password'})
				}
				else {
					//we're going to decrypt this token, then send it back to the '/me' path, using the middleware directly below
					console.log("IN ROUTER>POST AUTHENTICATE");
					var token = jwt.sign({ id: user._id, uuid: user.uuid, username: user.username, email: user.email }, secret, { expiresIn: '1hr' });
					res.json({ success:true, message: 'user authenticated', token:token});
				}
			}
		});
	});

	router.use(function(req, res, next){
		//can get token through 1) request, 2) url, or 3) headers
		var token = req.body.token || req.body.query || req.headers['x-access-token'];

		if(token) { //ie - if there's a token
			// verify a token symmetric, secret defined above earlier
			jwt.verify(token, secret, function(err, decoded) {
				//could land here if token has expired, as it'll still be detected..
				if(err) { 
					res.json({ success: false, message:'token invalid, an error occurred: ' + err	}); 
				}
				else{
					req.decoded = decoded;
					next(); //allows program to continue, in our case, '/me' is where we'll see this 
							//middleware in use
				}			  
			});
				
		} else {
			res.json({ success:false, message: 'no token provided'});
		}

	});

	/*	what does decoded do?:- takes token from request, url or header, combines it with the secret, 
		once verified it'll send back the decoded cookie,
	 	which contains the username and email

		when testing, we use rest client to authenticate ourselves, then attach the resulting token to
		the header we send to '/me', key is: x-access-token (x pronounced 'key' it seems)
	*/

	router.post('/me',function(req,res){		
		res.send(req.decoded);
	});

	return router;
}

