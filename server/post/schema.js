var mongoose = require('mongoose');
var Schema = mongoose.Schema({
	text: String,
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	viwed: [String],
	photos: [String],
	comments: [{
		author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		text: String
	}]
});

Schema.methods.create = function(obj, user, sd) {
	this.author = user._id;
	this.text = obj.text;
}

module.exports = mongoose.model('Post', Schema);
