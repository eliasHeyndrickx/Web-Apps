var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
	img: String,
	content: String,
	threadId: Schema.Types.ObjectId
});

module.exports = mongoose.model('Post', PostSchema);