const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'name is required'],
	},
	email: {
		type: String,
		required: [true, 'email is required'],
		unique: true,
		Lowercase: true,
		validate: [
			validator.isEmail,
			'please enter a valid email address',
		],
	},
	photo: { type: String },
	password: {
		type: String,
		required: [true, 'password is required'],
		minlength: 8,
		select: false,
	},
	passwordConfirmation: {
		type: String,
		required: [true, 'password confirmation is required'],
		validate: {
			// only works on create & save not for update!!
			validator: function (el) {
				return el === this.password;
			},
			message:
				'password confirmation is not the same as password',
		},
	},
});
userSchema.pre('save', async function (next) {
	//run this function if password is modified
	if (!this.isModified('password')) return next();
	//has with cost of 12
	this.password = await bcrypt.hash(this.password, 12);
	//delete password confirm field
	this.passwordConfirmation = undefined;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
