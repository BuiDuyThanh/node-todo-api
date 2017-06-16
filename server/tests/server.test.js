const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 333
}];

beforeEach((done) => {			// use this to make sure the database is empty before each test case
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);	// insert two todos
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);	// can use else instead
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})			// send invalid body data
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)		// convert ObjectID to HexString
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);		// todo is defined in server.js ES6 (res.send({todo}))
			})
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
			.get(`/todo/123`)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if object id is invalid', (done) => {
		request(app)
			.delete(`/todo/123`)
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = 'This should be the new text';

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: true,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});

	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = 'This should be the new second text';

		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed: false,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toNotExist();
		})
		.end(done);
	});
});