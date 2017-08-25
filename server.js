var express    = require('express');
var app 	   = express();
var port       = process.env.port || 8080;
//will return us coloured error codes
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var uuid = require('node-uuid');

var bodyParser = require('body-parser'); //parses body into JSON
var router 	   = express.Router();
var appRoutes  = require('./app/routes/api')(router,app,uuid);
//built in module
var path 	   = require('path');
var passport   = require('passport');
var social 	   = require('./app/passport/passport')(app, passport); //passing express functionality through app
var server = require('http').createServer(app)
var io = require("socket.io").listen(server);
var npid = require("npid");
// var uuid = require('node-uuid');
var Room = require('./room.js');
var _ = require('underscore')._;

var multer = require('multer');

app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://127.0.0.1");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.use(morgan('dev'));


var storage = multer.diskStorage({ //multers disk storage settings
      destination: function (req, file, cb) {
      	console.log("in var storage");
        // cb(null, './images/uploads/');
        cb(null, '//home/ofoley/CodingProjects/fbLoginToken - Copy/MEAN Stack App/public/images/uploads/');
        

      },
      filename: function (req, file, cb) {
      	console.log("setting file name");
        var datetimestamp = Date.now();                
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        
      }
    });

    
    var upload = multer({ //multer settings    	
      storage: storage      
    }).single('file');
    
    //test
    app.post('/upload', function(req, res) {    
	console.log("in /upload post ");
      upload(req,res,function(err){
      	console.log("aaa %s",req.file.path);
        if(err){
          res.json({error_code:1,err_desc:err});          
          return;
        }
        
        //console.log("hits %s".res.body);
        res.json({ error_code:0,err_desc:null,path:req.file.path, name:req.file.originalname });
      });
    });





app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended:true })); //for parsing application/x-www-form-urlencoded


app.use(express.static(__dirname + '/public'));

	/* Store process-id (as priviledged user) */
	try {
	    npid.create('/var/run/advanced-chat.pid', true);
	} catch (err) {
	    console.log(err);
	    //process.exit(1);
	}

// module provides functionality
app.use('/api', appRoutes);

/* ^^^ order important (listen for response, parse response, then route*/




mongoose.connect('mongodb://localhost:27017/', function(err){	
	if(err){
		console.log("NOT connected to the db: " + err);
	} else {
		console.log("successfully connected to db");
	}
});


//asterisk = all, urls start from same locale as server.js hence new path format
app.get('*', function(req,res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html' ));
})



server.listen(port, "127.0.0.1" ,function(){
	console.log('running the home world  that port wel call:  ' + port);
});


//required for chat feature provided through socket.io
io.set("log level", 1);
var people = {};
var rooms = {};
var sockets = [];
var chatHistory = {};

function purge(s, action) {
	/*
	The action will determine how we deal with the room/user removal.
	These are the following scenarios:
	if the user is the owner and (s)he:
		1) disconnects (i.e. leaves the whole server)
			- advise users
		 	- delete user from people object
			- delete room from rooms object
			- delete chat history
			- remove all users from room that is owned by disconnecting user
		2) removes the room
			- same as above except except not removing user from the people object
		3) leaves the room
			- same as above
	if the user is not an owner and (s)he's in a room:
		1) disconnects
			- delete user from people object
			- remove user from room.people object
		2) removes the room
			- produce error message (only owners can remove rooms)
		3) leaves the room
			- same as point 1 except not removing user from the people object
	if the user is not an owner and not in a room:
		1) disconnects
			- same as above except not removing user from room.people object
		2) removes the room
			- produce error message (only owners can remove rooms)
		3) leaves the room
			- n/a
	*/
	if (people[s.id].inroom) { //user is in a room
		var room = rooms[people[s.id].inroom]; //check which room user is in.
		if (s.id === room.owner) { //user in room and owns room
			if (action === "disconnect") {
				io.sockets.in(s.room).emit("update", "The owner (" +people[s.id].name + ") has left the server. The room is removed and you have been disconnected from it as well.");
				var socketids = [];
				for (var i=0; i<sockets.length; i++) {
					socketids.push(sockets[i].id);
					if(_.contains((socketids)), room.people) {
						sockets[i].leave(room.name);
					}
				}

				if(_.contains((room.people)), s.id) {
					for (var i=0; i<room.people.length; i++) {
						people[room.people[i]].inroom = null;
					}
				}
				room.people = _.without(room.people, s.id); //remove people from the room:people{}collection
				delete rooms[people[s.id].owns]; //delete the room
				delete people[s.id]; //delete user from people collection
				delete chatHistory[room.name]; //delete the chat history
				sizePeople = _.size(people);
				sizeRooms = _.size(rooms);
				io.sockets.emit("update-people", {people: people, count: sizePeople});
				io.sockets.emit("roomList", {rooms: rooms, count: sizeRooms});
				var o = _.findWhere(sockets, {'id': s.id});
				sockets = _.without(sockets, o);
			} else if (action === "removeRoom") { //room owner removes room
				io.sockets.in(s.room).emit("update", "The owner (" +people[s.id].name + ") has removed the room. The room is removed and you have been disconnected from it as well.");
				var socketids = [];
				for (var i=0; i<sockets.length; i++) {
					socketids.push(sockets[i].id);
					if(_.contains((socketids)), room.people) {
						sockets[i].leave(room.name);
					}
				}

				if(_.contains((room.people)), s.id) {
					for (var i=0; i<room.people.length; i++) {
						people[room.people[i]].inroom = null;
					}
				}
				delete rooms[people[s.id].owns];
				people[s.id].owns = null;
				room.people = _.without(room.people, s.id); //remove people from the room:people{}collection
				delete chatHistory[room.name]; //delete the chat history
				sizeRooms = _.size(rooms);
				io.sockets.emit("roomList", {rooms: rooms, count: sizeRooms});
			} else if (action === "leaveRoom") { //room owner leaves room
				io.sockets.in(s.room).emit("update", "The owner (" +people[s.id].name + ") has left the room. The room is removed and you have been disconnected from it as well.");
				var socketids = [];
				for (var i=0; i<sockets.length; i++) {
					socketids.push(sockets[i].id);
					if(_.contains((socketids)), room.people) {
						sockets[i].leave(room.name);
					}
				}

				if(_.contains((room.people)), s.id) {
					for (var i=0; i<room.people.length; i++) {
						people[room.people[i]].inroom = null;
					}
				}
				delete rooms[people[s.id].owns];
				people[s.id].owns = null;
				room.people = _.without(room.people, s.id); //remove people from the room:people{}collection
				delete chatHistory[room.name]; //delete the chat history
				sizeRooms = _.size(rooms);
				io.sockets.emit("roomList", {rooms: rooms, count: sizeRooms});
			}
		} else {//user in room but does not own room
			if (action === "disconnect") {
				io.sockets.emit("update", people[s.id].name + " has disconnected from the server.");
				if (_.contains((room.people), s.id)) {
					var personIndex = room.people.indexOf(s.id);
					room.people.splice(personIndex, 1);
					s.leave(room.name);
				}
				delete people[s.id];
				sizePeople = _.size(people);
				io.sockets.emit("update-people", {people: people, count: sizePeople});
				var o = _.findWhere(sockets, {'id': s.id});
				sockets = _.without(sockets, o);
			} else if (action === "removeRoom") {
				s.emit("update", "Only the owner can remove a room.");
			} else if (action === "leaveRoom") {
				if (_.contains((room.people), s.id)) {
					var personIndex = room.people.indexOf(s.id);
					room.people.splice(personIndex, 1);
					people[s.id].inroom = null;
					io.sockets.emit("update", people[s.id].name + " has left the room.");
					s.leave(room.name);
				}
			}
		}
	} else {
		//The user isn't in a room, but maybe he just disconnected, handle the scenario:
		if (action === "disconnect") {
			io.sockets.emit("update", people[s.id].name + " has disconnected from the server.");
			delete people[s.id];
			sizePeople = _.size(people);
			io.sockets.emit("update-people", {people: people, count: sizePeople});
			var o = _.findWhere(sockets, {'id': s.id});
			sockets = _.without(sockets, o);
		}
	}
}

io.sockets.on("connection", function (socket) {

	socket.on("joinserver", function(name, device) {
		var exists = false;
		var ownerRoomID = inRoomID = null;

		_.find(people, function(key,value) {
			if (key.name.toLowerCase() === name.toLowerCase())
				return exists = true;
		});
		if (exists) {//provide unique username:
			var randomNumber=Math.floor(Math.random()*1001)
			do {
				proposedName = name+randomNumber;
				_.find(people, function(key,value) {
					if (key.name.toLowerCase() === proposedName.toLowerCase())
						return exists = true;
				});
			} while (!exists);
			socket.emit("exists", {msg: "The username already exists, please pick another one.", proposedName: proposedName});
		} else {
			people[socket.id] = {"name" : name, "owns" : ownerRoomID, "inroom": inRoomID, "device": device};
			socket.emit("update", "You have connected to the server.");
			
			
			io.sockets.emit("update", people[socket.id].name + " is online.")
			sizePeople = _.size(people);
			sizeRooms = _.size(rooms);
			io.sockets.emit("update-people", {people: people, count: sizePeople});
			socket.emit("roomList", {rooms: rooms, count: sizeRooms});
			socket.emit("joined"); //extra emit for GeoLocation
			sockets.push(socket);
		}
	});

	socket.on("getOnlinePeople", function(fn) {
                fn({people: people});
        });

	socket.on("countryUpdate", function(data) { //we know which country the user is from
		country = data.country.toLowerCase();
		people[socket.id].country = country;
		io.sockets.emit("update-people", {people: people, count: sizePeople});
	});

	socket.on("typing", function(data) {
		if (typeof people[socket.id] !== "undefined")
			io.sockets.in(socket.room).emit("isTyping", {isTyping: data, person: people[socket.id].name});
	});

	socket.on("send", function(msTime, msg) {
		//process.exit(1);

		// messages not making it to here..
		console.log(msg);

		var re = /^[w]:.*:/;
		var whisper = re.test(msg);
		var whisperStr = msg.split(":");
		var found = false;
		if (whisper) {
			var whisperTo = whisperStr[1];
			var keys = Object.keys(people);
			if (keys.length != 0) {
				for (var i = 0; i<keys.length; i++) {
					if (people[keys[i]].name === whisperTo) {
						var whisperId = keys[i];
						found = true;
						if (socket.id === whisperId) { //can't whisper to ourselves
							socket.emit("update", "You can't whisper to yourself.");
						}
						break;
					}
				}
			}
			if (found && socket.id !== whisperId) {
				var whisperTo = whisperStr[1];
				var whisperMsg = whisperStr[2];
				socket.emit("whisper", {name: "You"}, whisperMsg);
				io.sockets.socket(whisperId).emit("whisper", msTime, people[socket.id], whisperMsg);
			} else {
				socket.emit("update", "Can't find " + whisperTo);
			}
		} else {
			if (io.sockets.manager.roomClients[socket.id]['/'+socket.room] !== undefined ) {
				io.sockets.in(socket.room).emit("chat", msTime, people[socket.id], msg);
				socket.emit("isTyping", false);
				if (_.size(chatHistory[socket.room]) > 10) {
					chatHistory[socket.room].splice(0,1);
				} else {
					chatHistory[socket.room].push(people[socket.id].name + ": " + msg);
				}
		    	} else {
				socket.emit("update", "Please connect to a room.");
		    	}
		}
	});

	socket.on("disconnect", function() {
		if (typeof people[socket.id] !== "undefined") { //this handles the refresh of the name screen
			purge(socket, "disconnect");
		}
	});

	//Room functions
	socket.on("createRoom", function(name) {
		if (people[socket.id].inroom) {
			socket.emit("update", "You are in a room. Please leave it first to create your own.");
		} else if (!people[socket.id].owns) {
			var id = uuid.v4();
			var room = new Room(name, id, socket.id);
			rooms[id] = room;
			sizeRooms = _.size(rooms);
			io.sockets.emit("roomList", {rooms: rooms, count: sizeRooms});
			//add room to socket, and auto join the creator of the room
			socket.room = name;
			socket.join(socket.room);
			people[socket.id].owns = id;
			people[socket.id].inroom = id;
			room.addPerson(socket.id);
			socket.emit("update", "Welcome to " + room.name + ".");
			socket.emit("sendRoomID", {id: id});
			chatHistory[socket.room] = [];
		} else {
			socket.emit("update", "You have already created a room.");
		}
	});

	socket.on("check", function(name, fn) {
		var match = false;
		_.find(rooms, function(key,value) {
			if (key.name === name)
				return match = true;
		});
		fn({result: match});
	});

	socket.on("removeRoom", function(id) {
		 var room = rooms[id];
		 if (socket.id === room.owner) {
			purge(socket, "removeRoom");
		} else {
                	socket.emit("update", "Only the owner can remove a room.");
		}
	});

	socket.on("joinRoom", function(id) {
		if (typeof people[socket.id] !== "undefined") {
			var room = rooms[id];
			if (socket.id === room.owner) {
				socket.emit("update", "You are the owner of this room and you have already been joined.");
			} else {
				if (_.contains((room.people), socket.id)) {
					socket.emit("update", "You have already joined this room.");
				} else {
					if (people[socket.id].inroom !== null) {
				    		socket.emit("update", "You are already in a room ("+rooms[people[socket.id].inroom].name+"), please leave it first to join another room.");
				    	} else {
						room.addPerson(socket.id);
						people[socket.id].inroom = id;
						socket.room = room.name;
						socket.join(socket.room);
						user = people[socket.id];
						io.sockets.in(socket.room).emit("update", user.name + " has connected to " + room.name + " room.");
						socket.emit("update", "Welcome to " + room.name + ".");
						socket.emit("sendRoomID", {id: id});
						var keys = _.keys(chatHistory);
						if (_.contains(keys, socket.room)) {
							socket.emit("history", chatHistory[socket.room]);
						}
					}
				}
			}
		} else {
			socket.emit("update", "Please enter a valid name first.");
		}
	});

	socket.on("leaveRoom", function(id) {
		var room = rooms[id];
		if (room)
			purge(socket, "leaveRoom");
	});
});
