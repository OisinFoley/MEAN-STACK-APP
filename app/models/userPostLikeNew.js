var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPostLikeNewSchema = new Schema ({

  user_uuid: {type:String, required:true }, 
  // contentPost_id : {type:String, required:true },
  // content_id: {type:String, required:true }, 
  dateAdded: {type:Date, required:true }  

});

module.exports = mongoose.model('UserPostLikeNew', UserPostLikeNewSchema);
