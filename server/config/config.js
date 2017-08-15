var env = process.env.NODE_ENV || 'development';		// NODE_ENV is set when run on test (defined in package.json) and production, otherwise development will be set
//	console.log('env *****', env);

if(env === 'development' || env === 'test') {
	var config = require('./config.json');
	var envConfig = config[env];

	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
}

/*

// heroku is 'production' so it won't pass in the below

if (env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

*/