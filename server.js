/*GENERAL TIP: 'app' FOLDER HOLDS BACKEND CONTENT */
/* comment always precedes line it's referring to 	*/

var express    = require('express');
var app 	   = express();
var port       = process.env.port || 8080;
//will return us coloured error codes
var morgan     = require('morgan');
var mongoose   = require('mongoose');

var bodyParser = require('body-parser'); //parses body into JSON
var router 	   = express.Router();
var appRoutes  = require('./app/routes/api')(router);
//built in module
var path 	   = require('path');
// var passport   = require('passport');
// var social 	   = require('./app/passport/passport')(app, passport);


//app.use(module) is how you interact with all middleware(any)
//not sure if all modules are middleware 
/* middleware */
app.use(morgan('dev'));
app.use(bodyParser.json()); //for parsing application/json, was used for a POST, but prob also needed for a GET
app.use(bodyParser.urlencoded({ extended:true })); //for parsing application/x-www-form-urlencoded
/*	this how we make our front-end directory available to us here
	it basically says wherever this file is(server.js), we have access to the named directory immediately deeper than it	*/
app.use(express.static(__dirname + '/public'));
/*	using this we will distinguish between later conflicting Angular routes
also means url of '/users' in api.js will render as '/api/users' 	*/
app.use('/api', appRoutes);
/* ^^^ order important (listen for response, parse response, then route*/



//cmd connection to db
//1) '"tutorials" needed in URL for non-duplication to be validated'
// mongoose.connect('mongodb://localhost:27017/', function(err){
//2) was having routing issue at one point, had to remove the 'tutorials' from the end of the URL, 
// find out how to set default port(already found) which also includes a sub-directory as part of it
mongoose.connect('mongodb://localhost:27017/', function(err){	
	if(err){
		console.log("NOT connected to the db: " + err);
	} else {
		console.log("successfully chchconnected to db");
	}
});


/*  'public' represents front-end
	asterisk means no matter what, send the index
	watch for missing beginnning slash	*/
app.get('*', function(req,res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html' ));
})



//server port
app.listen(port, function(){
	console.log('running the home world  that port wel call:  ' + port);
});