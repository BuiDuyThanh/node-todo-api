const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{		// user One with token
	_id: userOneId,
	email: 'thanhbui@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}, {
	_id: userTwoId,
	email: 'hoa@example.com',
	password: 'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 333,
	_creator: userTwoId
}];

const populateTodos = (done) => {			// use this to make sure the database is empty before each test case
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);		// insert two todos
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();	// save(), save data and running the middleware
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])	// using Promise.all() to make sure that two users were successfull saved to the database
												// the callback won't fire until all of those promises resolve
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};