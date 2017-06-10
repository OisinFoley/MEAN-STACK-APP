var FacebookStrategy = require('passport-facebook').Strategy;
var User 			 = require('../models/user');
var session 		 = require('express-session');
var jwt 	   	     = require('jsonwebtoken');
var secret	   		 = 'harrypotter';


module.exports = function(app,passport){

	
	//he says "for cookie, turn this to false" (perhaps that's if we want cookie to persist), (could also be for just wanting single session only)
	//in video the following two "app.use" come before this line
  	app.use(passport.initialize());
  	app.use(passport.session());
  	app.use(session({  secret: 'keyboard cat',  resave: false,  saveUninitialized: true,  cookie: { secure: false }}));

	passport.serializeUser(function(user, done) {
	  token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '1hr' });
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});  	

	passport.use(new FacebookStrategy({
	    clientID: '258839661189771',
	    clientSecret: '97170bfd22ae9af2272253b1a54a473a',
	    callbackURL: "http://localhost:8080/auth/facebook/callback",
	    profileFields: ['id', 'displayName', 'photos', 'email']
	  },
	  function(accessToken, refreshToken, profile, done) {
	  	//console.log(profile);
	  	//check terminal, it'll show the data as being inside '_json' specifically
	  	console.log("email from fb token is : " + profile._json.email);

	  	//now to check if user is in our own database
	  	//find the specified email, then choose the 3 params in .select, then exec...
	  	User.findOne({ email: profile._json.email }).select('username password email').exec(function(err, user) {
	  		//if (err) done(err);

	  		//if signing in with email that's not verified, the _json object whose properties we access will
	  		//be empty or undefined, creating a null user in the process
	  		if(user && user != null) {
	  			done(null, user);
	  		} else {
	  			done(err);
	  		}
	  	});	  		
	    // User.findOrCreate(..., function(err, user) {
	    //   if (err) { return done(err); }
	    //   done(null, user);
	    // });
	    // done(null, profile);
	  }
	));

	//can have a successRedirect parameter too, but the res. is habndling it while also passing the token
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req,res){		
		//redirects to a facebook view, passing token along for use in the front-end
		res.redirect('/facebook/'+ token); 
	});
	//Note that the URL of the callback route matches that of the callbackURL option specified when configuring the strategy.
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	return passport;
}