var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var User 			 = require('../models/user');
var session 		 = require('express-session');
var jwt 	   	     = require('jsonwebtoken');
var secret	   		 = 'harrypotter';
const util 			 = require('util');


module.exports = function(app,passport){
		
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
	  	
	  	console.log("email from fb token is : " + profile._json.email);
	  	
	  	User.findOne({ email: profile._json.email }).select('username uuid password email').exec(function(err, user) {
	  		
	  		if(user && user != null) {
	  			done(null, user);
	  		} else {
	  			done(err);
	  		}
	  	});	  		

	  }
	));

	passport.use(new TwitterStrategy({
	    consumerKey: '9lunlEGgII2j1XS9kwHKBJZws',
	    consumerSecret: 'qh8jkFoaRBlvpwjdDE88tbtUy3fB0cNyLUEbCd1RpJx34dAzv6',
	    callbackURL: "http://localhost:8080/auth/twitter/callback",
	    //profileFields: ['id', 'displayName', 'photos', 'email'],	    
	    //userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json"
	    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"﻿	    
	  },
	  function(token, tokenSecret, profile, done) {
	  	console.log("Profile is : " + profile.displayName);	    
	  	console.log("Profile is : " + profile);
	  	console.log("Profile is : " + profile.emails[0].value);

	  	User.findOne({ email: profile.emails[0].value }).select('username uuid password email').exec(function(err, user) {
	  		
	  		if(user && user != null) {
	  			done(null, user);
	  		} else {
	  			done(err);
	  		}
	  	});
	  }
	));

	
	passport.use(new GoogleStrategy({		
	    clientID: '248816080905-8aet6m91qbvt84rgunocu97poapjjq77.apps.googleusercontent.com',	    
	    clientSecret: 'pLiFoyz8plzCE-e7NM_pqobO',
	    callbackURL: "http://localhost:8080/auth/google/callback"
	  },	  
	  function(accessToken, refreshToken, profile, done) {	
	  	//entire profile can't be updated in the following way
	  	//console.log("GOOGLE profile without util is: " + profile);
	  	//the following are all valid but longer ways to achieve what we want below. seemed like only way up to a point.
	  	// console.log("GOOGLE profile.email without util is: " + profile.emails[0].value);	  		
	  	//console.log("using util 'profile' output is : " + util.inspect(profile, false, null));	  	
	 	//could also do the following if we only needed to use 'util' module once in our app. TwitterStrategy also making use of it.
	 	//console.log("using require(util) 'email' output is : " + require('util').inspect(profile.emails[0].value, false, null));	 
	  	// console.log("using JSON Stringify 'profile' output is : " + JSON.stringify(profile, null, 4));

	  	// can log whole object by using the following ES6 style syntax template literal
	  	console.log("Profile is : ", profile);﻿


	  	/* util will work on even a general javascript object, whereas json.stringify will not. handy to know
	  	https://stackoverflow.com/questions/10729276/how-can-i-get-the-full-object-in-node-jss-console-log-rather-than-object*/
	  		  	
	    User.findOne({ email: profile.emails[0].value }).select('username uuid password email').exec(function(err, user) {
	  		
	  		if(user && user != null) {
	  			done(null, user);
	  		} else {
	  			done(err);
	  		}
	  	});
	  }
	));



	app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read', 'profile', 'email'] }));
		
	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
		// incorrect redirect (googleerror) will cause all to execute but no record of authentication, so no token
	    res.redirect('/google/' + token);
	});

	   
	app.get('/auth/twitter', passport.authenticate('twitter'));
	
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req,res){				
		res.redirect('/twitter/'+ token); 
	});


	//Note that the URL of the callback route matches that of the callbackURL option specified when configuring the strategy.
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	//can have a successRedirect parameter too, but the res. is habndling it while also passing the token
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req,res){		
		//redirects to a facebook view, passing token along for use in the front-end
		res.redirect('/facebook/'+ token); 
	});

	return passport;
}