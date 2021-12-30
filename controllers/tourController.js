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

  /* Execute query:*/
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

  // Tour.findOne({_id: req.params.id});

  // We're doing this in a query middleware:
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: 'guides',
  //   select: '-__v -passwordChangedAt'
  // });

  const tour = await Tour.findById(req.params.id).populate('reviews');
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
