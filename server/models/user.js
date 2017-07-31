const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
//			validator: (value) => {
//				return validator.isEmail(value);
//			},
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

// instant method
UserSchema.methods.generateAuthToken = function () {
	var user = this;	// instant variable (lowercase variable) called with individual document
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens.push({access, token});

	//----//
	return user.save().then(() => {
		return token;
	});

	/* Same as:

	user.save().then(() => {
		return token;
	}).then((token) => {
	
	});

	*/
};

UserSchema.methods.removeToken = function (token) {
	var user = this;

	return user.update({
		$pull: {			// remove the token, id and access property
			// check if the token in parameter match the one in tokens array
			tokens: {token} // {token: token}
		}
	});
};

// Model method
UserSchema.statics.findByToken = function (token) {
	var User = this;	// model variable (uppercase variable) called with Model binding
	var decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch (e) {
		return Promise.reject();	// this is used by catch((e)) in server.js
	/*	
		return new Promise((resolve, reject) => {
			reject();
		});
	*/
	}

	return User.findOne({		// return the User here to take user as parameter in findByToken().then(user) (server.js)
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};


UserSchema.statics.findByCredentials = function (email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if (!user) {
			return Promise.reject();	// trigger the catch in the server.js
		}

		return new Promise((resolve, reject) => {
			// Use bcrypt.compare to compare password and user.password
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

// using Mongoose Middleware to automatically run some code (in this case, check and hash password) before a certain event (save document event in this case)
UserSchema.pre('save', function (next) {
	var user = this;

	if (user.isModified('password')) {	// check if the new password is set. If it is new, hash it; otherwise next(). It prevents the hashed password not to be hashed again
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;	// override the plain text password to hashed password
				next();
			});
		});
	} else {
		next();
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};