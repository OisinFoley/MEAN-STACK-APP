var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var ContentPostNew    = require('../models/contentNew');


var ContentNewSchema = new Schema({
  title: {type:String, required:true}, 
  isThread : {type:Boolean, required:true},
  //with this we can use filtering to display active threads and posts from the last 24 hours
  dateModified: {type:Date, required:true },    
  dateAdded: {type:Date, required:true },
  uuid: {type:String, required:true} , 
  url: {type:String, required:false},
  //posts:{[], required:false}
  //posts: [ContentPostSchema]
  posts: {type:[ContentPostNew], required:false},
  favourites: {type:[ContentPostNew], required:false}
	  
});



ContentNewSchema.plugin(titlize, {
  paths: [ 'title' ]  
});

module.exports = mongoose.model('ContentNew', ContentNewSchema);