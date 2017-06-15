const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*
Todo.remove({}).then((result) => {		// remove and display the number of removed
	console.log(result);
});
*/

// Todo.findOneAndRemove	--> remove and display the removed doc

/*
Todo.findOneAndRemove({_id: '5941c97d30b8d91fb58774df'}).then((todo) => {

});
*/

// Todo.findByIdAndRemove	--> remove by Id

Todo.findByIdAndRemove('5941c97d30b8d91fb58774df').then((todo) => {
	console.log(todo);
});