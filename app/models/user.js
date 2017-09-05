var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');


var nameValidator = [
  validate({
    validator: 'matches',
    //arguments: '/^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/',
    arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/, 
    message: 'Name must be at least 3 characters, most 30, no special characters, must contain space between name.'  
  }),
  validate({
    validator: 'isLength',
    arguments: [3,30], //first and last name can each be between 3 and 20, but overall length has to be less than 30
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} in length'
  })
];

var emailValidator = [
  validate({
    validator: 'isEmail',      
    message: 'not a valid email.'    
  }),
  validate({
    validator: 'isLength',
    arguments: [3,25],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} in length'
  })
];

//allows trailing spaces at end-only, but they're not persisted to db
var usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3,25],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} in length'
  }),  
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain letters and numbers only only'
  })
];


var passwordValidator = [  
  validate({
    validator: 'matches',    
    // ^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}
    // \d is digit, \W not word, digit, or whitespace, ie - we expect a symbol
    //if we use .{3,}, we need a string length of at least 3, not 3 of each condition(a-z and A-Z)
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
    message: 'Password needs to have one of each: lowercase character, uppercase character, number, symbol, as well as being 8-35 characters long.'    
  })
];



var UserSchema = new Schema({
  name: {type:String, required:true, validate : nameValidator }, //setting validation
  email : {type:String, lowercase:true, required:true, unique:true, validate : emailValidator},
  username: {type:String, lowercase:true, required:true, unique:true, validate : usernameValidator}, 
  password: {type:String, required:true, validate : passwordValidator }  
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

UserSchema.plugin(titlize, {
  paths: [ 'name' ]  
});

UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password); // this.password being the hashed password stored away 
}

//careful of writing model as the object of exports, and the same with mongoose being the object of model property
module.exports = mongoose.model('User', UserSchema);
