
// Set up
var express 		= require('express');
var app					= express();
var router 			= express.Router();
var crypto			= require('crypto');

//var bodyParser	= require('body-parser'); 

// Multer configuration
var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/tmp/');
  },
  filename: function (req, file, cb) {
  	console.log(file);
    cb(null, 
    	crypto.createHash('sha1').update(JSON.stringify(file))
    				.digest('hex') + "_" + file.originalname);
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

// Configuration
app.use(express.static(__dirname + '/public'));
//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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
		if(err) console.log(err);
		res.json(threads);
	});
	
});

// Thread routing
router.post('/thread/newThread', upload.single('threadImg'), function(req, res, next) {
	console.log("Processing New Thread...");
	
	var file = req.file; 
  var threadData = JSON.parse(req.body.data);

  console.log(threadData.title);
  console.log(threadData.boardId);

  var thread = new Thread({
  	title: threadData.title,
  	boardId: +threadData.boardId,
  	img: '/img/tmp/' + file.filename
  });

  thread.save(function(err, thread){
  	if(err){
  		console.log(err);
  		res.send(false);
  	}else{
  		res.send(true);
  	}
  });

});

router.get('/public', function(req, res){
	res.sendfile('./dist/index.html');
});

console.log("Starting up server!");

app.listen(4000);

// Methods
function stringStartsWith (str, prefix) {
    return str.slice(0, prefix.length) == prefix;
}





















