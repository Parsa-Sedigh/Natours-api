'use strict';

const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

/* It's better to call the separate routers (routers that have separate files), just routers instead of tourRouter or ... and then
export and then import these separate routers into our main file. (When we have only one thing to export, we use module.exports = <the thing>) */
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkId)

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router
  .route('/')
  // .get(authController.protect, tourController.getAllTours)
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect ,authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(authController.protect ,authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// This doesn't belong to tour router:
// router
//   .route('/:tourId/reviews')
//   .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);


module.exports = router;
