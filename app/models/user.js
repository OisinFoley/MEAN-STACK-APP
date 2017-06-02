var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	username: {type:String, lowercase:true, required:true, unique:true}, //setting validation
	password: {type:String, required:true}, //setting validation
	email	: {type:String, lowercase:true, required:true, unique:true}
});

/*encrypt schema just before save, pword-only*/
UserSchema.pre('save', function(next) {  
  var user = this; /*whoever comes through this middleware, we have neater access to properties using 'this'*/
  bcrypt.hash(user.password,null,null, function(err,hash){ //encrypts for sending and storing
  		if(err) return next(err);
  		user.password = hash;
  		next(); //after hashing, middleware knows to exit
  });
  
});


//careful of writing model as the object of exports, and the same with mongoose being the object of model property
module.exports = mongoose.model('User', UserSchema);
