const express = require('express');
const tourController = require('./../controllers/tourController');
const checkBody = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const router = express.Router();
//rzouter.param('id', tourController.checkID);
router
	.route('/top-5-cheap')
	.get(
		tourController.aliasTopTours,
		tourController.getAllTours
	);

router
	.route('/tour-stats')
	.get(tourController.getTourStats);
router
	.route('/monthly-plan/:year')
	.get(tourController.getMonthlyPlan);
router
	.route('/')
	.get(authController.protect, tourController.getAllTours)
	.post(tourController.createNewTour);
router
	.route('/:id')
	.get(tourController.getOnetour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

module.exports = router;