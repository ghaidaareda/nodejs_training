//wrapper function for async fun to catch errors
module.exports = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch((err) => next(err));
	};
};
