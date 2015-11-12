
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

// Seeds
var seeder 		= require('seeder');
var board_overview = require('./seeds/overview.json');

mongoose.connect('mongodb://localhost/hexchan');

mongoose.connection.on('open', function mongooseOpen(err){
	if(err) throw err;

	seeder(board_overview, mongoose, console.log, function done(err){
		if(err){
			console.log(err);
		} 
		console.log("Seeding complete!");
	});

});

// Routing
router.param('boardId', function(req, res, next, id){
	var query = Board.find({_id: id});

	query.exec(function (err, board){
    if (err) { return next(err); }
    if (!board) { return next(new Error("Can't find board!")); }

		console.log(board);

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

router.get('/public', function(req, res){
	res.sendfile('./dist/index.html');
});

console.log("Starting up server!");

app.listen(process.env.PORT || 3000);





















