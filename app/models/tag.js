var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var TagSchema = new Schema({
  tagName: {type:String, required:true },
  dateAdded : {type:Date, required:true }  
});

TagSchema.plugin(titlize, {
  paths: [ 'tagName' ]  
});

module.exports = mongoose.model('Tag', TagSchema);