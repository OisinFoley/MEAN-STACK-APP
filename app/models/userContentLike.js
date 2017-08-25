var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//will need to generate a UserContentLike._id too
var UserContentLikeSchema = new Schema({
  content_id: {type:String, required:true },   
  user_id : {type:String, required:true },
  dateAdded: {type:Date, required:true }  
});


module.exports = mongoose.model('UserContentLike', UserContentLikeSchema);