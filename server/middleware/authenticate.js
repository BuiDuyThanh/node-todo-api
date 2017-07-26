var {User} = require('./../models/user');

// middleware function
var authenticate = (req, res, next) => {
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject();	// throw the reject, and the catch((e)) below will be executed
			// res.status(401).send();
		}

		req.user = user;	// modify the request object to match user found
		req.token = token;
		next();			// call next() to allow the route below to continue execute after authenticate function
	}).catch((e) => {
		res.status(401).send();
	});
};

module.exports = {authenticate};