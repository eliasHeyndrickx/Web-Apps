var mongoose = require('mongoose');

var ThreadSchema = new mongoose.Schema({
	img: String,
	title: String,
	boardId: Number
});

module.exports = mongoose.model('Thread', ThreadSchema);