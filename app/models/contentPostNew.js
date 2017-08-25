var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var ContentPostLikeNew    = require('../models/userPostLikeNew');

var ContentPostNewSchema = new Schema ({

// user_id: { type:String, required:true }, 
postText : {type:String, required:true },  
user_uuid: {type:String, required:true} , 
dateAdded: {type:Date, required:true }

//likes: {type:[ContentPostLikeNew], required:false}  

});

module.exports = mongoose.model('ContentPostNew', ContentPostNewSchema);