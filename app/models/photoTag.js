var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoTagSchema = new Schema({
  photoID: {type:String, required:true },
  tagID : {type:String, required:true },
  dateAdded : {type:Date, required:true }  
});

module.exports = mongoose.model('PhotoTag', PhotoTagSchema);