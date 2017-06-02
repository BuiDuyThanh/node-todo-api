var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');		// config to connect mongoose to mongodb

module.exports = {mongoose};	// mongoose: mongoose