var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PhotoSchema = new Schema({
  description: {type:String, required:true }, 
  url: {type:String, required:true },
  dateAdded : {type:Date, required:true }  
});

module.exports = mongoose.model('Photo', PhotoSchema);