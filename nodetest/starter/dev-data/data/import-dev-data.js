const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		//console.log(con.connections);
		console.log('db connection established');
	});

//read json file
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8')
);
//import to database
const importData = async () => {
	try {
		await Tour.create(tours);
		console.log('data successfully loaded');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

//delete all data from database
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log('data successfully deleted');
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
}
console.log(process.argv);
