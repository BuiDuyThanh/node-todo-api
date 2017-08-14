require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

//const port = process.env.PORT || 3000;		// PORT will be set when it's deployed onto Heroku, and it won't be set when run locally (run on port 3000 instead)
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
//	console.log(req.body);
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id	// find the all todos posted by the this signed in user
	}).then((todos) => {
		res.send({todos});		// better use object instead of pure array
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	})
});

app.delete('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});	// ~~ {todo: todo}
	}).catch((e) => {
		res.status(400).send();
	});
});

app.patch('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);		// pull the properties out of the req.body and put them into var body. User can only change 'text' and 'completed'

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set: body}, {new: true}).then((todo) => {	// {new: true} return the new updated one, not original
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});

});

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {		// user.save().then((user) => {
		return user.generateAuthToken();

	//	res.send(user);
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	})
});

app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send();
	});

});

app.get('/users/me', authenticate, (req, res) => {		// use middleware function (authenticate) to make private
	res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

/*
var newTodo = new Todo({			// create new instance
	text: 'Have lunch'
});

newTodo.save().then((doc) => {		// save to update database
	console.log('Saved todo', doc);
}, (e) => {
	console.log('Unable to save todo');
});

var newUser = new User({
	email: '   buiduythanh6291@gmail.com     '
});

newUser.save().then((doc) => {
	console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
	console.log(e);
});

*/

module.exports = {app};