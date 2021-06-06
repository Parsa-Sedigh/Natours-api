'use strict';

const express = require('express');
const tourController = require('../controllers/tourController');

/* It's better to call the separate routers (routers that have separate files), just routers instead of tourRouter or ... and then
export and then import these separate routers into our main file. (When we have only one thing to export, we use module.exports = <the thing>) */
const router = express.Router();

/* Now let's say this is a request that is done all the time and we want to provide a route that is simple
and easy to memorize for the user. So we need to create a new route. Let's call this new route, top-5-cheap
and we just need to make availabe a get request to this route.So we say .route().get()
Now how we want to implement the top-5-cheap tours functionality? Well, in essence, what we want is actually
still get all of the tours and make some changes (top 5 cheap of them) to them. So let's copy the tourController.getAllTours .
We copied tourController.getAllTours , because it doesn't really make sense to rewrite all of the logic, but we need to
apply some changes to that, right? So before calling the getAllTours route handler, we want to prefill some of the fields in
the query string. Because we already know that the query string for this route would look like:
?sort=-ratingsAverage,price&limit=5 (with some more stuff).
The solution is to run a middleware, before we run the getAllTours handler and that middleware function is gonna manipulate
the query object that's coming in.
So let's create aliasTopTours middleware. (This middleware needs to have the next arg (third arg) in order to call the next
middleware or handler.)
 
Remember: When you want to pick a name for a route, it's good to not use a verb, because the verb is kind of defined in HTTP method name.
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
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
