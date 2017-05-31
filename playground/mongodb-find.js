// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');	// using return to prevent the rest of the function to execute; we can use else for below console.log instead
	}
	console.log('Connected to MongoDB server');

/*
	db.collection('Todos').find({
		_id: new ObjectID('592e4cd44af20704d1f79a94')
//		completed: false
	}).toArray().then((docs) => {
		console.log('Todos');
		console.log(JSON.stringify(docs, undefined, 2))
	}, (err) => {
		console.log('Unable to fetch todos', err);
	});
*/

	db.collection('Todos').find({completed: true}).count().then((count) => {
		console.log(`Todos count: ${count}`);
	}, (err) => {
		console.log('Unable to fetch todos', err);
	});

//	db.close();
});