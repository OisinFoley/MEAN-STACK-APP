var User 	   = require('../models/user');

//'router'(express middleware) was defined in server and is passed to us when calling this module in its own code
module.exports = function(router){
	//:8080/users
	router.post('/users', function(req,res){
		//res.send("<h1>testing user's route</h1><br/><br/><h5>yo yo yo </h5>");
		var user = new User();
		//request usually sent through browser in this code base
		user.username = req.body.username;
		user.password = req.body.password;
		user.email 	  = req.body.email;
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
			res.send('ensure uname, pword and email were provided');
		} else {
			user.save(function(err){
				if (err) {
					res.send("username or email already exists");
				}
				else {
					res.send("user created"); //just so we know it worked
				}
			});
		}	
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