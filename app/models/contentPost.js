var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//will need to generate a post._id too
var ContentPostSchema = new Schema({
//auto-generated _id will act as contentPost_id later
  content_id: {type:String, required:true }, 
  user_id: { type:String, required:true }, 
  postText : {type:String, required:true },  
  dateAdded: {type:Date, required:true }  
});



module.exports = mongoose.model('ContentPost', ContentPostSchema);