var User 	   = require('../models/user');

//'router'(express middleware) was defined in server and is passed to us when calling this module in its own code
module.exports = function(router){
	// :8080/api/users
	/*	 USER REGISTRATION	*/
	router.post('/users', function(req,res){		
		var user = new User();		
		user.username = req.body.username;
		user.password = req.body.password;
		user.email 	  = req.body.email;
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {			
			res.json({	success:false, message:'ensure uname, pword and email were provided'	});
		} else {
			user.save(function(err){
				if (err) {
					res.json({	success:false, message:'username or email already exists'	});
					//res.send("");
				}
				else {
					//referenced in resgister.html and userCtrl.js
					res.json({	success:true, message:'user created'	});					
				}
			});
		}	
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
					res.json({ success:true, message: 'user authenticated'})
				}
			}
		});
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