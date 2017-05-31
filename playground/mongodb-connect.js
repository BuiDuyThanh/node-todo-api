// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');	// using return to prevent the rest of the function to execute; we can use else for below console.log instead
	}
	console.log('Connected to MongoDB server');

/*

	db.collection('Todos').insertOne({			// insertOne to add document into connection
		text: 'Something to do',
		completed: false
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert todo', err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});


	db.collection('Users').insertOne({
		name: 'Thanh',
		age: 26,
		location: 'Espoo'
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert user', err);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});

*/	

	db.close();
});