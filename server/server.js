var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
const port = process.env.PORT || 3000;		// PORT will be set when it's deployed onto Heroku, and it won't be set when run locally (run on port 3000 instead)

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