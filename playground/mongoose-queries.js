const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var todoId = '593f01393a44389157776148';
var userId = '5931323533e83bb51041ee71';

if (!ObjectId.isValid(todoId)) {
	console.log('Id not valid');
};

Todo.find({
	_id: todoId
}).then((todos) => {
	console.log('Todos', todos);
});

Todo.findOne({
	_id: todoId
}).then((todo) => {
	console.log('Todo', todo);
});

Todo.findById(todoId).then((todo) => {
	if (!todo) {
		return console.log('Id not found');		// return to terminate the program immediately, this is use for throwing error when the id does not exist
	}
	console.log('Todo By Id', todo);
}).catch((e) => console.log(e));			//	this catch used to throw error when the id is in the invalid form ()

User.findById(userId).then((user) => {
	if (!user) {
		return console.log('Unable to find user');
	}
	console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
	console.log(e);
});