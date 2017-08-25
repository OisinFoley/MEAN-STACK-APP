var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//will need to generate a UserContentLike._id too
var UserContentLikeNewSchema = new Schema({ 
  user_uuid : {type:String, required:true },
  dateAdded: {type:Date, required:true }  
});


module.exports = mongoose.model('UserContentLikeNew', UserContentLikeNewSchema);