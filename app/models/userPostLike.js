var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//will need to generate a UserPostLike._id too
var UserPostLikeSchema = new Schema({
  user_id: {type:String, required:true }, 
  contentPost_id : {type:String, required:true },
  content_id: {type:String, required:true }, 
  dateAdded: {type:Date, required:true }  
});


module.exports = mongoose.model('UserPostLike', UserPostLikeSchema);