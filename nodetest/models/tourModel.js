const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'tour must have a name'],
			unique: true,
			trim: true,
			maxlength: [
				40,
				'tour name must have less or equal 40 characters',
			],
			minlength: [
				10,
				'tour name must be at least 10 characters',
			],
			// validate: [
			// 	validator.isAlpha,
			// 	'name must only contain characters',
			// ],
		},
		slug: { type: String },
		duration: {
			type: Number,
			required: [true, 'tour must have a duration'],
		},
		maxGroupSize: {
			type: Number,
			required: [true, 'tour must have a group size'],
		},
		difficulty: {
			type: String,
			required: [true, 'tour must have a difficulty'],
			enum: {
				values: ['easy', 'medium', 'difficult'],
				message:
					'difficulty must be easy, medium, or difficult',
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, 'rating must be between 1 and 5'],
			max: [5, 'rating must be between 1 and 5'],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, 'tour must have a price'],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (value) {
					//only works on current document in creation only but noe update
					return value < this.price;
				},
				message:
					'discount ({VALUE})must be below the price',
			},
		},
		summary: {
			type: String,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			required: [true, 'tour must have a description'],
		},
		imageCover: {
			type: String,
			required: [true, 'tour must have an image'],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tourSchema.virtual('durationWeeks').get(function () {
	return this.duration / 7;
});

//document middleware for pre & post doc create or save
tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// tourSchema.post('save', function (doc, next) {
// 	console.log(doc);
// 	next();
// });

// query middleware for pre & post find query

tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now();
	next();
});

tourSchema.post(/^find/, function (docs, next) {
	console.log(
		`Quey took ${Date.now() - this.start} miliseconds to complete`
	);
	console.log(docs);
	next();
});

//aggregation middleware
tourSchema.pre('aggregate', function (next) {
	this.pipeline().unshift({
		$match: { secretTour: { $ne: true } },
	});
	console.log(this.pipeline());
	next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

// const testTour = new Tour({
// 	name: 'The park ',
// 	price: 480,
// 	rating: 4.8,
// });

// testTour
// 	.save()
// 	.then((doc) => {
// 		console.log(doc);
// 	})
// 	.catch((err) => {
// 		console.log('ERROR:', err);
// 	});
