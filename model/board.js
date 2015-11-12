var mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
	_id: Number,
	img: String,
	title: String
});

module.exports = mongoose.model('Board', BoardSchema);