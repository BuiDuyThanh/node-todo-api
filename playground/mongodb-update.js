// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');	// using return to prevent the rest of the function to execute; we can use else for below console.log instead
	}
	console.log('Connected to MongoDB server');

/*
	db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID('592e5bf6f7ffdca832b6049e')	// filter
	}, {
		$set: {
			completed: true
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	})
*/
	db.collection('Users').findOneAndUpdate({
		name: 'Linh'
	}, {
		$set: {
			name: 'My'
		},
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});
	db.close();
});