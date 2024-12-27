class AppError extends Error {
	constructor(message, statusCode) {
		super(message); // message is the only parameter that bilt in accepts
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4')
			? 'failed'
			: 'error';
		this.isOperational = true; // all errors creatd in this class will be operational

		Error.captureStackTrace(this, this.constructor); //not to be captured by the stack trace
	}
}
module.exports = AppError;
