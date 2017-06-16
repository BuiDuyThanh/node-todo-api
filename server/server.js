require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

//const port = process.env.PORT || 3000;		// PORT will be set when it's deployed onto Heroku, and it won't be set when run locally (run on port 3000 instead)
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
//	console.log(req.body);
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});		// better use object instead of pure array
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	})
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});	// ~~ {todo: todo}
	}).catch((e) => {
		res.status(400).send();
	});
});

app.patch('/todos/:id', (req, res) => {
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

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {	// {new: true} return the new updated one, not original
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
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