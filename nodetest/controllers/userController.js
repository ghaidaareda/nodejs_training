const User = require('./../models/userModel');

const catchAsync = require('./../utils/catchAsync');
exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		status: 'success',
		requestedat: users.length,
		data: { users },
	});
});
exports.getOneUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'this route is not yet implemented',
	});
};
exports.createNewUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'this route is not yet implemented',
	});
};
exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'this route is not yet implemented',
	});
};
exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'this route is not yet implemented',
	});
};
