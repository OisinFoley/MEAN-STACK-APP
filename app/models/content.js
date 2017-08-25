var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var ContentSchema = new Schema({
  title: {type:String, required:true}, 
  isThread : {type:Boolean, required:true},
  //with this we can use filtering to display active threads and posts from the last 24 hours
  dateModified: {type:Date, required:true },    
  dateAdded: {type:Date, required:true }
});

ContentSchema.plugin(titlize, {
  paths: [ 'title' ]  
});

module.exports = mongoose.model('Content', ContentSchema);