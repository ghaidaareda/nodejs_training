const express = require('express');
fs = require('fs');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globlErrorHandlers = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// middleware
const app = express();

if (process.env === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());
//serve static files from folders not from server
app.use(express.static(`${__dirname}/starter/public`));

// app.use((req, res, next) => {
// 	console.log('hello from middleware');
// 	next();
// });

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter); //middleware to connect router to this app
app.use('/api/v1/users', userRouter);

app.all('*', function (req, res, next) {
	// const err = new Error(
	// 	`can't find ${req.originalUrl} on this server`
	// );
	// err.status = fail;
	// err.statusCode = 404;
	next(
		new AppError(
			`can't find ${req.originalUrl} on this server`,
			404
		)
	);
});

app.use(globlErrorHandlers);

module.exports = app;
