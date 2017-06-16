var env = process.env.NODE_ENV || 'development';		// NODE_ENV is set when run on test and production, otherwise development will be set
//	console.log('env *****', env);

if (env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
