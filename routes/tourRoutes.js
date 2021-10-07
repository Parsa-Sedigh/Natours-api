'use strict';

const express = require('express');
const tourController = require('../controllers/tourController');

/* It's better to call the separate routers (routers that have separate files), just routers instead of tourRouter or ... and then
export and then import these separate routers into our main file. (When we have only one thing to export, we use module.exports = <the thing>) */
const router = express.Router();

// router.param('id', tourController.checkId)

/* Remember: When you want to pick a name for a route, it's good to not use a verb, because the verb is kind of defined in HTTP method name.
So for example for pick a name for our tour stats, we don't name it '/get-tour-stats' but '/tour-stats' . But it's not a problem
that use verbs in name of route handler functions.Like getTourStats() .*/
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
