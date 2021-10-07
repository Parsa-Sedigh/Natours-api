'use strict';

const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/* Now the __dirname value is pointing to routes folder, instead of app.js which is in root. So we must change the path for readFileSync()
method.
const appFileName = __dirname.replace(/\\/g, '/');
const tours = JSON.parse(fs.readFileSync(`${appFileName}/../dev-data/data/tour-simple.json`)); */
/* exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is : ${val}`);

    if (req.params.id * 1 > tours[tours.length - 1].id) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        });
    } else {
         We MUST call next(), because otherwise the request-response cycle will get stuck in this middleware function (so it won't get to
        controllers or route handler functions).
        next();
    }
}; */

/* exports.checkBody = (req, res, next) => {
     But why we created this middleware? Instead we could check the body in createTour route handler function!!
     No, it would be a bad practice.The createTour route handler must have it's own functionality and not anything else.
     So we can create a middleware (which has next arg) to check the body data, instead of createTour and if the body was alright,
     we call next() which will go to createTour function.
     And also remember that return keyword in if statement is very important.Because if we don't specify it, well the middleware
     send a response and after that keeps going further, but we don't want this.We want it to not call the next middleware and
     finish the req-res cycle by sending a response.

     When we have 400 status code, the status is 'fail'.

     Mongoose will take care of required fields, so we can get rid of this middleware.

     if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    } else {
        next();
    }

}; */

exports.getAllTours = catchAsync(async (req, res, next) => {
  /* Instead of keeping all of the features of our API in this function, we create a class for our APIFeatures and put each one
  of our API features in one method of that class. */
  /* 1-A)Filtering:
  const queryObject = {...req.query};
  const excludedFields = ['page', 'sort', 'limit', 'fields'];

  excludedFields.forEach(el => delete queryObject[el]);
  let queryStr = JSON.stringify(queryObject);

  1-B) Advanced filtering

  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      return `$${match}`;
  });

  let query = Tour.find(JSON.parse(queryStr));
  */
  /* 2) Sorting the results:

   if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
   }
   Let's sort docs in desc order based their createdAt field in desc order, so the newest ones always appear first.
  */
  /* 3) Field limiting:

  if (req.query.fields) {
      let fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
  } else {
      query = query.select('-__v');
  }*/
  /* If user didn't specify the fields in query string: */

  /* 4) Pagination:
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit; */

  /* We must check the query string that has a page parameter or not? Because if it hasn't, we wouldn't have any skip and therefore, we won't
  have any error that says: This page doesn't exist:

  if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
          throw new Error('This page does not exist.');
      }
  }

  query = query.skip(skip).limit(limit); */

  /* Execute query:

  Why we didn't use
  if (!tour) {
  return next(new AppError('No tour found with that ID.', 404));
  }
  In this function?
  When 0 results found, for example there are no results matching for a filter or because the page was requested that doesn't
  exist, then of course we could consider sending a 404 error and saying that the data was not found. But that error is not
  entirely correct in this specific request. Because there was really no error. I mean the request was correctly received and then
  the database correctly searched for the tours and found 0 results and so these 0 records are exactly what we're gonna send back along
  with 200 HTTP status code. So again we consider there can't be really an error, when a user requests ALL of the tours. Unless of course
  there are some failures in the database  or something like that and in those cases mongoose will AUTOMATICALLY throw an error which
   would catched by our catchAsync function which it's responsibility is to catch errors of our functions in one place instead of
   writing catch blocks in each of our functions and then catchAsync function would send that error to our global handling middleware
   by saying next(err) .*/
  //TODO Tour also works for first arg of new APIFeatures WHY??? and also in filter method of class, we are AGAIN using .find() on model???
  const features = new APIFeatures(Tour.find(), req.query);
  features.filter().sort().limitFields().paginate();

  // const tours = await query;
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // try {
  //     const tour = await Tour.findById(req.params.id);
  //     res.status(200).json({
  //         status: 'success',
  //         data: {
  //             tour: tour
  //         }
  //     });
  // } catch (err) {
  //     res.status(404).json({
  //         status: 'failed',
  //         message: 'Invalid data sent.'
  //     });
  // }
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    /* In JS, null is a falsey value or in other words a value that will convert to false. So if there is no tour, we want
    to just straight into our global error handler middleware. So we must use next(error) .
    Also it is very crucial to say return here. Because we don't want to execute any further code after creating this error.
    As soon as next() receives something, it assumes that is an error and will jump straight into global error handling
    middleware which this middleware will send the response from our API. */
    return next(new AppError('No tour found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  //
  // tours.push(newTour);
  // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {
  //     res.status(201).json({
  //       status: "success",
  //       data: {
  //         tour: newTour
  //       }
  //     });
  //   });

  /* try {
      const newTour = await Tour.create(req.body);
      res.status(201).json({
          status: 'success',
          data: {
              tour: newTour
          }
      });
  } catch (err) {
      res.status(400).json({
          status: 'failed',
          message: err
      });
  }*/

  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  /* When we update an object or a resource, we send back 200 for status code.*/
  // try {
  //     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  //         new: true,
  //         runValidators: true
  //     });
  //     res.status(200).json({
  //         status: 'success',
  //         data: {
  //             tour
  //         }
  //     });
  // } catch (err) {
  //     res.status(400).json({
  //         status: 'failed',
  //         message: 'Invalid data sent.'
  //     });
  // }
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  /* We need to save the result of awaiting the Tour.findByIdAndDelete(req.params.id) . */
  // try {
  //     await Tour.findByIdAndDelete(req.params.id);
  //     res.status(204).json({
  //         status: 'success',
  //         data: null
  //     });
  // } catch (err) {
  //     res.status(400).json({
  //         status: 'failed',
  //         message: 'Invalid data sent.'
  //     });
  // }
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  // let statsBasedOnDifficulty =  Tour.aggregate([
  //     {
  //         $match: { ratingsAverage: { $gte: 3 } }
  //     },
  //     {
  //         $group: {
  //             _id: { $toUpper: '$difficulty' },
  //             numResultsInThisGroup: { $sum: 1 },
  //             avgRating: { $avg: '$ratingsAverage' },
  //             avgPrice: { $avg: '$price' }
  //         }
  //     },
  //     {
  //         $sort: {
  //             avgPrice: 1
  //         }
  //     },
  //     {
  //         $match: {
  //             _id: { $ne: 'EASY' }
  //         }
  //     }
  // ]);
  //
  // let statsBasedOnDuration = Tour.aggregate([
  //     {
  //         $match: { ratingsQuantity: { $gte: 20 } }
  //     },
  //     {
  //         $group: {
  //             _id: '$duration',
  //             numResultsInThisGroup: { $sum: 1 }
  //         }
  //     }
  // ]);
  //
  // [totalStats, statsBasedOnDifficulty, statsBasedOnDuration] = await Promise.all([totalStats, statsBasedOnDifficulty,
  //     statsBasedOnDuration]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      // statsBasedOnDifficulty,
      // statsBasedOnDuration
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  /*Problem: Implement a function that calculates the busiest month of a given year.
So basically by calculating how many tours start in each month of the given year.
First create the function and after this create a route for this function. Let's call it '/monthly-plan'
Remember: For the things that you want to pass in to .aggregate() method, first you pass in an array and then in that array
we pass in one object for each of the stages we want.
Actually we want to count how many tours exist for each of the months in the given year.
Learn: $unwind stage deconstruct an array field from the docs and then outputs one document for each element of the array and in
 our problem we want to have one tour for each of the elements in startDates array field. So for the value of $unwind we specify the
 field which is an array and we want to deconstruct that array and make each of the elements in that array, a separate document.

When we use $unwind on a field specified as the value of $unwind, in results, we longer would have that field as an array and
now we have each element in startDates array as a separate field. After $unwind stage, we must select the documents for the year that
user was passed in. So the results we want to send to user must have a same year that user passed in.So we can use $match to send the
results that have a same year which user requested. So we want the tours in the year that user requested. So the startDates of these
tours must be in the year that user requested in other words, the startDates can be from first day of year until last day of year.

Remember: The value of $group stage must be an object which we have a field called _id in that object and the docs will group together
based on this field. So Learn: $match is just for select some docs based on some conditions.

Important: The key of a key-value pair in stage objects can not be the name of a field that has a $ and quotes around it.

Important: The _id field would be usually in $group stage and maybe other stages. In $group with this field we can group docs that have the same field
 which is specified in the value of _id.

In this problem we want to group docs based on their month. BUT currently we have the ENTIRE date, not only the month. So we have the year, the month,
the day and even the hour and ... .But we want to have only the month to group them. For this task we can use another new mongo operator.
It's called $month which returns the month as a number.So it would basically EXTRACT the month out of our date. For value of
this $month operator, we pass it the name of the field that we want to extract the month from it.
Now after soecifying the _id for grouping, we can specify the real information that we want for each of those groups is how many
tours START in that month? We can count the amount of tours that have a certain month.

Learn: In $group stage, after specifying the field that you want to group docs based on that field, you should specify the
 data that you want to see in EACH GROUP. That data could be the number of docs in each group, or average of a field in each group,
 or highest (maximum) of a field in each group and ... . In this case we're counting number of docs in each group and the arbitrary key name
 for that field is numTourStarts .
After calculating number of docs in each group, we need some more information about which tours are in this group and not just the
number of docs in each group. So we can specify an arbitrary name for the key that we want to show the information of tours (which I named it tours)and
then because possibly we have more than 1 tour in each group, we must show their information in an array, right? Because if you
don't want to use an array, for this, how could you show the information of 2 or 3 or ... tours in one field? So for creating an array,
so we use $push to push the name field of each document that goes through this pipeline for EACH GROUP.

Now we want to change the name of _id field. Which we haven't access to that directly, it's a bit tricky. The solution is we can add another
field which has the exact value of _id (the value of _id field is '$_id') in each group but with a different name and after creating that
new field which is gonna be exist for each group, we can delete _id field from each group and now we have a new field which has the
same value for each group.
In $addFields stage, we must specify the NAME of the field that we want in the key of $addFields object and the value of that key is the actual value
of that newly created field.

Now we need to delete the _id key-value pair from the groups. So we can use $project stage. For the value of $project, we give it an object
and in this object we can exclude or include some fields.

In the value for $sort stage, the key name is the field name that we want to sort docs based on it and the value of that key is 1 or -1
1 is for ascending.
In this case and in $limit stage, we specify we want to have 12 results (in this case, it would say that we want just 12 groups.)*/
  // try {
  //     const year = req.params.year * 1;
  //     const plan = await Tour.aggregate([
  //         {
  //             $unwind: '$startDates'
  //         },
  //         {
  //             $match: {
  //                 startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
  //             }
  //         },
  //         {
  //             $group: {
  //                 _id: { $month: '$startDates' },
  //                 numTourStarts: { $sum: 1 },
  //                 tours: { $push: '$name' }
  //             }
  //         },
  //         {
  //             $addFields: {
  //                 month: '$_id'
  //             }
  //         },
  //         {
  //             $project: {
  //                 _id: 0
  //             }
  //         },
  //         {
  //             $sort: {
  //                 numTourStarts: -1
  //             }
  //         },
  //         {
  //             $limit: 12
  //         }
  //     ]);
  //     res.status(200).json({
  //         status: 'success',
  //         data: {
  //             plan
  //         }
  //     });
  //
  // } catch(err) {
  //     console.log(err);
  //     res.status(404).json({
  //         status: 'failed',
  //         message: err
  //     });
  // }
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

/* Because we don't have only one thing to export, so we are not going to use module.exports, but instead we will put all of the
things we want to export inside exports object. So for example instead of saying :
const getAllTours = () => {...};
we must say:
exports.getAllTours = () => {...}; */
