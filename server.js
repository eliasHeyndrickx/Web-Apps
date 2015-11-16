
// Set up
var express 		= require('express');
var app					= express();
var router 			= express.Router();
var bodyParser	= require('body-parser'); 

// Configuration
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', router);

// Mongoose & MongoDB
var mongoose	= require('mongoose');

// Schema's
var Board = require('./model/board.js');
var Thread = require('./model/thread.js');

// Seeds
var seeder 		= require('seeder');
var board_overview = require('./seeds/overview.json');
var threads = require('./seeds/thread.json');


mongoose.connect('mongodb://localhost/hexchan');

mongoose.connection.on('open', function mongooseOpen(err){
	if(err) throw err;

	// Seeding board overview
	seeder(board_overview, mongoose, console.log, function done(err){
		if(err){
			console.log(err);
		} 
		console.log("Seeding boards overview complete!");
	});

	// Seeding catalog board
	seeder(threads, mongoose, console.log, function done(err){
		if(err){
			console.log(err);
		} 
		console.log("Seeding threads complete!");
	});

});

// Routing

// Board Routing
router.param('boardId', function(req, res, next, id){
	var query = Board.find({_id: id});

	query.exec(function (err, board){
    if (err) { return next(err); }
    if (!board) { return next(new Error("Can't find board!")); }

    req.board = board;
    return next();
  });
});

router.get('/boards', function(req, res){
	Board.find({}, function(err, boards){
		if(err) console.log(err);
		res.json(boards);
	});
});

router.get('/board/:boardId', function(req, res, next){
	res.json(req.board);
});

router.get('/board/:boardId/threads', function(req, res, next){
	console.log(req.board[0]._id);

	Thread.find({boardId: req.board[0]._id}, function(err, threads){
		console.log(threads);
		if(err) console.log(err);
		res.json(threads);
	});
	
});


router.get('/public', function(req, res){
	res.sendfile('./dist/index.html');
});

console.log("Starting up server!");

app.listen(3000);





















