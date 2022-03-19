const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for requested tour (including reviews and tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build the template

  // 3) Render template using the data from 1)
  res.status(200)
    .set('Content-Security-Policy',
      'default-src \'self\' https://*.mapbox.com ;base-uri \'self\';block-all-mixed-content;font-src \'self\' https: data:;frame-ancestors \'self\';img-src \'self\' data:;object-src \'none\';script-src https://cdnjs.cloudflare.com https://api.mapbox.com \'self\' blob: ;script-src-attr \'none\';style-src \'self\' https: \'unsafe-inline\';upgrade-insecure-requests;')
    .render('tour', {
      title: `${tour.name} Tour`,
      tour
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

// we don't query to get the current user, because that has already done in the protect middleware.
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser  = await User.findByIdAndUpdate(req.user.id, {
      name: req.body.name,
      email: req.body.email
    },
    { new: true, runValidators: true });
  res.status(200).render('account', {
    title: 'Your account',
    /* need to pass in the user object to template OURSELVES, because the protect middleware's user object is old user not the updated one that we update
     here, so we need to pass it to template here and not let the protect middleware pass the old user object.*/
    user: updatedUser
  });
});

// Find all the tours that the user has booked
exports.getMyTours = catchAsync(async (req, res, next) => {
  /* Find all the bookings for the currently logged-in user which will then give us a bunch of tour ids and then we have to
  find the tours with those ids.
  Instead, we could also do a virtual populate on the tours. But in this case, let's do it manually.
  One of the reasons that we want to do this manually instead of using a virtual populate is to use the $in operator. But you can do this with virtual populate too,
  just for fun!*/
  // 1) Find all bookings
  const bookings = await Booking.find({user: req.user.id});

  // 2) Find tours with the returned ids
  const tourIds = bookings.map(el => el.tour);

  // Here, we can not use findById(), because we want to use an operator which is $in .
  const tours = await Tour.find({_id: {$in: tourIds}});

  // we're gonna re-using the overview template:
  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});
