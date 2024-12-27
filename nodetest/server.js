const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
	console.log(err.name, err.message);
	console.log('uncaughtException 💥!: shutting down');
});
dotenv.config({ path: './config.env' });
const app = require('./app');
const { updateSearchIndex } = require('./models/tourModel');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		connectTimeoutMS: 30000, // Increase timeout to 30 seconds
		socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
	})

	.then((con) => {
		//console.log(con.connections);
		console.log('db connection established');
	});

//start server
const port = process.env.port || 3000;
const server = app.listen(port, () => {
	console.log(`app is listening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	console.log('unhandledRejection 💥!: shutting down');
	server.close(() => process.exit(1));
});

//every thing that is out side the scope of express goes here...

//console.log(process.env);
