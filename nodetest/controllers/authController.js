const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE_IN,
	});
exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirmation: req.body.password,
	});

	const token = signToken(newUser._id);
	res.status(200).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});
exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	//1.check if email & password exists!
	if (!email || !password) {
		return next(
			new AppError('Please provide email and password', 400)
		);
	}

	//2.check if user exists && password is correct
	//user is User document s it a result of querying user model
	const user = await User.findOne({ email }).select(
		'+password'
	);
	console.log(user);
	//3.if every thing is ok send token to client
	//instance methods are available to all documents

	if (
		!user ||
		!(await user.correctPassword(password, user.password))
	) {
		return next(
			new AppError('Incorrect email or password', 401)
		);
	}

	const token = signToken(user._id);
	res.status(200).json({ status: 'sucess', token });
});

exports.protect = catchAsync(async (req, res, next) => {
	//1)get token & check it is there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('you are not logged in '));
	}
	//2)verify token
	const decoded = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);
	//3)check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError('the token is no longer valid', 401)
		);
	}
	//4)check if user change password after token was issued
	next();
});
