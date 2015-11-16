var mongoose = require('mongoose');

var ThreadSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	img: String,
	title: String,
	boardId: Number
});

module.exports = mongoose.model('Thread', ThreadSchema);