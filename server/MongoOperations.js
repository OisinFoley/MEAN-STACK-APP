//this file currently not in use. would be good practice to separate from sevrer.js file

mongoose.connect('mongodb://localhost:27017/tutorial', function(err){
    if(err){
        console.log("NOT connected to the db: " + err);
    } else {
        console.log("successfully chchconnected to db");
    }
});

/* "mongoose.connect" is the same as below
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', function () {
    
});
*/

