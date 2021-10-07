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

tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;


