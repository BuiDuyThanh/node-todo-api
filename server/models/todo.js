var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {			// define a model
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	},
	_creator: {		// '_' indicates the ObjectId type
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

module.exports = {Todo};