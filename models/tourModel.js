'use strict';

const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "A tour must have a name."],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal than 40 characters."],
      minlength: [10, "A tour name must have more or equal than 10 characters."],
      // validate: [validator.isAlpha, 'Tour name must only contain characters.'],
      validate: {
        validator: function (val) {
          /* Important: In validator callback function, this.<field name> and val (if provided in parameters), is equal. */

          const regExp = new RegExp(/^([A-Za-z0-9\s]*)$/);
          return regExp.test(val);
        },
        message: 'Tour name must only contain characters, whitespaces and digits.'
      }
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration."]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size."]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty."],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either easy, medium or difficult."
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating average must be above 1.0"],
      max: [5, "Rating average must be below 5.0"]
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price."]
    },
    priceDiscount: {
      type: Number,
      validate:
        {
          validator: function(val) {
            return val < this.price;
          },
          message: 'Discount price ({VALUE}) can\'t be lower than price.'
        }
    },
    summary: {
      type: String,
      required: true,
      trim: [true, "A tour must have a summary."]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image."]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

/* Document middlewares */
tourSchema.pre("save", function(next) {
  //console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* This post() is not a post request. It means we define a middleware after the save event. How I find that out? Well because
* we are using post() method on a schema not on route(). */
tourSchema.post("save", function(doc, next) {
  next();
});

/* Query middlewares
* tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
}); */
tourSchema.pre(/^find/, function(next) {
  /* Let's create a clock to measure how long it takes to execute the CURRENT query. So we can simply create a property on this
  * keyword object. Because this query object is just a regular object.
  * Date.now() will give us the current time in milliseconds*/
  this.start = Date.now();
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds.`);
  next();
});

/* Aggregation middlewares:
* this.pipeline() is simply the array that we passed to the .aggregate() method in route handlers that are responsible for the
* route that the user sent request and are using .aggregate() method in themselves. For example if a user sends a request to a
* route that it's handler functions are using .aggregate() in themselves, this aggregate middleware would run.
*
* Now because this.pipeline() in we have exactly the pipeline that we specified in the route handler, we can filter out the secret
* tours by adding another $match stage, right at the beginning of this pipeline array.
* Remember that this.pipeline() in an aggregation middleware is an array and we want to add another element to the BEGINNING
* of this array. So we must use unshift() which is a method for arrays. Why at the beginning? Because we want to execute further
* stages based on the public tours and not secret tours, so we MUST add that stage at the beginning. So basically we're
* removing all the docs that have secretTour set to true from results.
*
* We have also model middleware.
* So mongoose middlewares are cool stuff that we can add to our models.For example we could implement instance methods which are
* methods that will be available on every document after being queried.*/
tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;


