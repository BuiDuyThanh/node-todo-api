var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');		// config to connect mongoose to mongodb. Connect to whether heroku uri or localhost if failed. Command 'heroku config' to check heroku URI

module.exports = {mongoose};	// mongoose: mongoose