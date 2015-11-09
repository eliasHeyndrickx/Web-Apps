
// Set up
var express 		= require('express');
var app					= express();
var router 			= express.Router();
var bodyParser	= require('body-parser'); 

// Configuration
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', router);

// Mongoose & MongoDB
var mongoose	= require('mongoose');

//require('./models/posts.js');
//require('./models/comments.js');

//mongoose.connect('mongodb://localhost/news');

// Routing
//require('./routes/home.js')(router, mongoose);

/*
router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function(err, post){
		if(err) return next(err);
		if(!post) return next(new Error("can't find post"));

		req.post = post;
		return next();
	});
});
*/

router.get('/', function(req, res){
	res.sendfile('./public/index.html');
});

console.log("Starting up server!");

app.listen(8080);

























