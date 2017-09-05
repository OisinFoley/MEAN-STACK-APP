var User 	   = require('../models/user');
var jwt 	   = require('jsonwebtoken');
var secret	   = 'harrypotter';

//'router'(express middleware) was defined in server and is passed to us when calling this module in its own code
module.exports = function(router){
	// :8080/api/users
	/*	 USER REGISTRATION	*/
	router.post('/users', function(req,res){		
		var user = new User();		
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

							res.json({ success: false, message: 'Username or e-mail already taken' }); 
						} else{
							res.json({	success:false, message: err	}); 		
						}					
					}
				} else {					
					res.json({	success:true, message:'user created'	});					
				}									
			});
		}	
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
		//res.send('testing authenticate route');
		User.findOne({ username: req.body.username}).select('email username password').exec(function(err, user){
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
					var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '1hr' });
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


/*
exporting our module back to server.js means we are no longer using 'app'(middleware from server)
hence now using 'router'
app.get('/', function(req,res){
	res.send("yo world");
})
app.get('/home', function(req,res){
	res.send("sup from home world");
})

*/