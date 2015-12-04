// Set up
var express 		= require('express');
var bodyParser	= require('body-parser'); 
var jwt 				= require('express-jwt');
var app					= express();
var router 			= express.Router();
var uuid 				= require('uuid');
var mongoose		= require('mongoose');
var passport 		= require('passport');

// Registering models
// Schema's
var Board 	= require('./model/board.js');
var Thread 	= require('./model/thread.js');
var Post 		= require('./model/post.js');
var User 		= require('./model/user.js');

// Configuration
require('./config/passport');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '2mb'}));
app.use('/', router);
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
app.use(passport.initialize());

// JWT tokens
var auth = jwt({secret: 'HexKey', credentialsRequired: false, userProperty: 'loginData'});

// Multer configuration
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/tmp/');
  },
  filename: function (req, file, cb) {

  	cb(null, (function(){
  		var fileType = file.mimetype.split('/')[1];

    	return uuid.v4() + "." + fileType;
  	})());

  }
})

function fileFilter (req, file, cb) {
	if(stringStartsWith(file.mimetype, "image/"))
  	cb(null, true);
  else
  	cb(null, false);
}

var upload = multer({
	storage: storage,
	fileFilter: fileFilter
});

// Seeds
var seeder 		= require('seeder');

var boards		= require('./seeds/boards.json');
var threads		= require('./seeds/threads.json');
var posts			= require('./seeds/posts.json');
var users			= require('./seeds/users.json');

mongoose.connect('mongodb://localhost/hexchan');

mongoose.connection.on('open', function mongooseOpen(err){
	if(err) throw err;

	// Seeding boards
	seeder(boards, mongoose, console.log, function done(err){
		if(err){
			console.log(err);
		} 
		console.log("Seeding boards complete!");
	});

	// Seeding threads
	seeder(threads, mongoose, console.log, function done(err){
		if(err){
			console.log(err);
		} 
		console.log("Seeding threads complete!");
	});

	// Seeding posts
	seeder(posts, mongoose, console.log, function done(err){
		if(err){
			console.log(err);
		} 
		console.log("Seeding posts complete!");
	});

	// Seeding users
	seeder(users, mongoose, console.log, function done(err){
		if(err){
			console.log(err);
		} 
		console.log("Seeding users complete!");
	});

});

// Routing

function isValidBoardId(id){
	return !isNaN(id);
}

function isValidThreadId(id){
	return /^[0-9a-f]{24}$/.test(id);
}

// Board Routing
router.param('board', function(req, res, next, id){
	if(!isValidBoardId(id)){
		res.status(404).send("Invalid board id!");
	}else{
		var query = Board.findOne({_id: +id});

		query.exec(function (err, board){
	    if (err) { return next(err); }
	    if (!board) { 
	    	res.status(404).send("Can't find board!");
	    }else{
	    	req.board = board;
	    	return next();
	    }
	  });
	}
});

// Thread Routing
router.param('thread', function(req, res, next, id){
	if(!isValidThreadId(id)){
		res.status(404).send("Invalid thread id!");
	}else{
		var query = Thread.findOne({_id: id});

		query.exec(function (err, thread){
	    if (err) { return next(err); }
	    if (!thread) { 
	    	res.status(404).send("Can't find thread!"); 
	    }else{
	    	req.thread = thread;
	    	return next();	
	    }
	  });
	}	
});

// Returning Board ID's
router.param('boardId', function(req, res, next, id){
	if(!isValidBoardId(id)){
		res.status(404).send("Invalid board id!");
	}else{
		req.id = id;
		return next();
	}
});

router.param('threadId', function(req, res, next, id){
	if(!isValidThreadId(id)){
		res.status(404).send("Invalid thread id!");
	}else{
		req.id = id;
		return next();
	}
});

// Get all boards
router.get('/boards', function(req, res){
	Board.find({}, function(err, boards){
		if(err) console.log(err);
		res.json(boards);
	});
});

// Get specific board
router.get('/board/:board', function(req, res, next){
	res.json(req.board);
});

// Get all threads from specific board
router.get('/threads/:boardId', function(req, res, next){

	// Check if board exists
	Board.findOne({_id: req.id}, function(err, board){

		if(board === null){
			res.status(404).send("Can't find board!"); // Send error
		}else{
			// Get thread from board
			Thread.find({boardId: req.id}, function(err, threads){
				if(err) console.log(err);
				res.json(threads);
			});
		}

	});
	
});

// Get specific thread
router.get('/thread/:thread', function(req, res){
	res.json(req.thread);
});

// Thread routing
router.post('/thread/newThread', upload.single('threadImg'), function(req, res, next) {
	console.log("Processing New Thread...");
	
	var file = req.file; 
  var threadData = JSON.parse(req.body.data);

  var thread = new Thread({
  	title: threadData.title,
  	boardId: +threadData.boardId,
  	img: '/img/tmp/' + file.filename
  });

  thread.save(function(err, thread){
  	if(err){ // On failure
  		console.log(err);
  		res.send(false);
  	}else{ // On succes
  		res.send(thread);
  	}
  });

});

// Get all posts from specific thread
router.get('/posts/:threadId', function(req, res, next){
	Post.find({threadId: req.id}, function(err, posts){
		if(err) console.log(err);
		res.json(posts);
	});
});

// Post routing
router.post('/post/newPost', auth, upload.single('postImg'), function(req, res, next) {
	console.log("Processing New Post...");

	var postData = JSON.parse(req.body.data);

	var post = new Post({
		author: (typeof req.loginData === "undefined") ? "" : req.loginData.username,
		content: postData.content,
		threadId: mongoose.Types.ObjectId(postData.threadId),
		img: (!req.hasOwnProperty("file")) ? "" : '/img/tmp/' + req.file.filename
	});

  post.save(function(err, post){
  	if(err){
  		res.send(false);
  	}else{
  		res.send(true);
  	}
  });

});

// Login Routing

// Register
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password)
    return;
  
  var user = new User({
  	username: req.body.username
  });

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

// Login
router.post('/login', function(req, res, next){

  if(!req.body.username || !req.body.password)
    return;

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.get('/public', function(req, res){
	res.sendfile('./public/index.html');
});

console.log("Starting up server!");

app.listen(3000);

// Methods
function stringStartsWith (str, prefix) {
    return str.slice(0, prefix.length) == prefix;
}





















