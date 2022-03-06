"use strict";

// const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) GLOBAL Middlewares
// Serving static files:
app.use(express.static(path.join(`${__dirname}/public`)));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API(IP??? API is wrong here)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser(reading data from the body (and put it) into req.body)
/* express.json() returns a function and that function always would added to middleware stack.
We use express.json() middleware in order to parse the data from body on req object. But in past, we have to use bodyParser.json()
But in the last version, we don't have to use bodyParser.json() and instead we can use express.json()   */
app.use(express.json({limit: '10kb'}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS(cross site scripting) attacks
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

// Test middleware
/* We could name any of these args anything else, but the order of them matter.
In next arg, express passes the next function as the third arg into this middleware function and basically all of the middleware functions.*/
app.use((req, res, next) => {
  // console.log('hello');
  /* Important: The code in our middlewares ALWAYS run each time a new request go through the pipeline and after all of the
      codes in middlewares we call next() to take request to the next middleware (if you don't call this next(), the request or
      the data will stuck in that middleware!). So we must call next() in all of our at least OUR OWN middlewares.
    Learn: So remember: The middlewares apply to each and every single request and that's because we didn't specify any route that this
     custom middleware would apply to it. So because we don't specify any routes for this middleware to apply to it, it will apply
     to any request that hits the server, no matter of url.
     All of the route handlers are actually kind of middleware too! But they only applies to a certain URL. But the more simple
     middleware functions (like the middlewares that we define ourselves- like this middleware function that we are currently in)
     they will apply to every single request, IF THEY WAS CALLED!!! So if this simple middleware was after one of the route handler middlewares
     that was responsible for request, it won't called!
     So if the request hits server with the url for example '/api/v1/tours' and with get http method, if this simple middleware was
     after that app.get(), it won't be called! Because in that route handler, we end the request-response cycle by saying res.json()
     (if we say res.send() or res.<any other methods> the request-response cycle will end and no other middleware will run- But also
     remember when we say res.<...> we won't call next() function after that right?! Because well, we want to send the response and
     we don't want to run any other middleware or something else!)

    Important: So if a simple middleware like this middleware (which applies to all of the requests) was before middlewars like app.router()
     or app.get() which ends the request-response cycle, it would be called because it is in middleware stack! But if simple middlewares
     were after middlewars that end the request-response cycle, it won't called. */
  /* So if we want a certain middleware runs or executed in every and each request, we must declare it before all of our
    route handlers and the middlewares that end the request-response cycle (even if the middleware stack is still remains).  */
  next();
});

/* Let's add a middleware that add current time property to req object(a middleware that manipulate the req object in each request.)  */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});



app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewsRouter);

app.all('*', (req, res, next) => {
  /* res.status(404).json({
      status: 'fail',
     message: `Can't find ${req.originalUrl} on this server.`
   });

Also after commenting out the res.status(404).json({}) code, I commented out these lines of code, because they are using the
built-in Error class but we have created our custom error class.

const err = new Error(`Can't find ${req.originalUrl} on this server.`);
err.status = 'fail';
err.statusCode = 404;

Now we are going to create the appError object from AppError class, right in the parentheses of next() :*/

  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

/* app.use((err, req, res, next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

Important: We shouldn't CALL the external function(other middlewares) inside app.use() . So if you have created a function you shouldn't use
 () for calling that function inside app.use() . So when you want to CALL a middleware inside app.use() you must do it without it's
 parentheses, in parentheses of app.use() or app.METHOD() . So we shouldn't manually call the globalErrorHandler function here by saying
 globalErrorHandler() therefore express itself must call this function, as soon as we have an error.
 */

app.use(globalErrorHandler);

/* Now how we connect this new router with our application? We will use it as middleware and this is because this new modular tool router (tourRouter
variable), is actually a real middleware. So we can create a app.use() for these routers and say we want to add this middleware to
our application or middleware stack on '/api/v1/tours' route.

So we must change the nodemon app.js to nodemon server.js . This way, we no longer have to really know which is the file that
I actually want to run. So all we have to write is npm start . Otherwise, we have to think, hmmm is it app.js or server.js? To
start nodemon. So instead of saying nodemon app.js or ... we just say npm start and this way we don't have to worry about the
name of the file. Also this script works, even without having nodemon installed as our dev dependency IF WE INSTALLED nodemon GLOBALLY.
If nodemon is not installed globally, just install it globally, or you can instead install it as dev dependency.
Learn: npm run start or npm start is both equavilant IF THE NAME OF THE SCRIPT IN package.json is a simple name. So if the name
 of the script is start:dev or ... it's not simple and we MUST say: npm run start:dev . But if it was a simple name we could
 ignore the run keyword.


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

4)Start the sever
The related codes must go to server.js */

module.exports = app;
