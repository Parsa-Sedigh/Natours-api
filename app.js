"use strict";

// const fs = require('fs');
const express = require("express");

/* morgan is a 3ed party logging middleware function that allow us to see request data in the console. This package makes development easier
* but still IT IS SOME CODE that we include in our app so this package is not a development dependency and it's a regular dependency. */
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//1) Middlewares

/* Calling the morgan() will return a function similar to (req, res, next) => {...} function, because this is how a middleware function
* has to look like.
* Remember: When we require the morgan package, what will get returned is the morgan function. Because they used module.exports(). and the
* morgan function actually returns another function called logger and this logger function has the typical middleware signature which
* is (req, res, next) => {...} and in the end it calls next().
* After using this middleware if client send a request to server, we get http method, the url, the status code, the time it took to
* send back the response and also the size of response in bytes. You can also save these logs to a file.
*
* You might ask why we have access to the NODE_ENV env variable when we didn't define them in this file but in server.js . So how
* it is possible? The reading of the variables from .env file and save it to node process, only needs to HAPPEN ONCE. After that
* those variables are in the process and process is available no matter which file we're currently in.
* Important: The next if statement and other codes like that are codes that run based on the environment of our application. */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* express.json() returns a function and that function always would added to middleware stack.
We use express.json() middleware in order to parse the data from body on req object. But in past, we have to use bodyParser.json()
But in the last version, we don't have to use bodyParser.json() and instead we can use express.json()   */
app.use(express.json());

/* How serve static files with express? static file are files that are sitting in our file system that we currently can't access
them using our routes. For example we currently can't access overview.html (or anything is inside public folder) via browser.
So if you write http://localhost:3000/public/overview.html , it won't work, because we didn't define any routes for this url.So
we don't have any route handler that is associated with this route.
Remember static files are like html files or images or ...
So if we want to access something from our file system, we need to use a built-in express middleware.
In parentheses of static() function we pass in the directory that in that directory we want to serve static files.
After using this middleware, if you visit that prior URL with a little difference in browser you can visit that static file.
So now the URL would be: http://localhost:3000/overview.html
So without defining any routes and route handler functions we can visit these static files.
But why we don't need public folder in URL? Because when we open up a url, that the browser can't find in any of routes, it will
then look in the public folder that we defined and it kind of sets that folder to the root.So let's pretend that the root is now
our public folder and overview is in there, so that's why we have access to it.
But if you write http://localhost:3000/img/ , it will throw an error. Because this is not a file and this looks like a regular route
so express tries to find a route handler function for this URL, but it can't. Because we didn't define any ROUTE HANDLER for this url.
So when a user looks for a static file, express wont't go into a new route, but simply serve that file that we specified in the
folder in middleware.
So with this middleware, we served static files from a folder and not from a route.  */
app.use(express.static(`${__dirname}/public`));

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

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

/* Let's write a handler for undefined routes. So basically the routes that we didn't assign any route handler function yet.
Remember: For error handling in API context, it doesn't make sense to send back HTML! So we must create a handler function
for all of the routes that are not catched by our routers.
Now how are we gonna implement a route handler for a route that was not catched by any of our route handlers?
Solution: We know that all of the middleware functions are executed in order that they are in the code. So the idea is if we have a
request that makes it into this part of our code (after those middlewares for our ACTUAL routes-section 3), so it means that neither
tourRouter nor the userRouter, were able to catch that request. So it has a strange or unacceptable route. So if we add a middleware
after those routers, it will only reached if was not handled by any of other routers. Now let's specify this middleware which is a
route handler middleware.
Now the question is what would be the http method of this route handler, get? post? ... ? Do we must write handlers for all of
these? No. We simply want to handle all the routes(urls), with one handler. So we can use: app.all()
So app.all() will run for all of the http methods in the specified route.
Now we want to handle all the URLs that were not handled before, so we can use *.
So as you can see, for the second arg of app.all() or app.use() or app.get() or... , which is the handler function, we can declare
the function right there, or we can just name the function (kinda reference it-like what we did in our routes files)

Again: If the request was able to reach until this point, it means that the request-response cycle was not yet finished at this point in
our code.Because remember that middlewares are gonna run by order that they defined in our code.

req.originalUrl is the url that user requested it.

Important: Sending a response to user, (like res.status.json() or res.send() or ...) won't stop your middleware stack IF YOU CALL next() .
 BUUUUUUUUUUUUUUT!!!!! When you want to end the app from further execution in the middleware, you shouldn't use next() to actually end
 the request-response cycle. Right? Like what we did here. So here we want to end the app from running further for execution code. So we
 didn't call next() .

If we put this middleware on top of all of our other middlewares for handling routes, no matter what request we send to server, it
will always run this middleware and it will say: Can't find this route!!! Even if we send a valid request to a valid route! Because
the request would go to this middleware and send back to user and no other code would be executed.*/
app.all("*", (req, res, next) => {
  /*
   res.status(404).json({
      status: 'fail',
     message: `Can't find ${req.originalUrl} on this server.`
   });

  I commented out the above lines, because now we handle all of the operational errors of application, with one global error handler
  * middleware.So let's create the err object, which that global error handler middleware needs.

  In Error() constructor we can pass a string and that string will be the err message property.
  *
  * Also after commenting out the res.status(404).json({}) code, I commented out these lines of code, because they are using the
  * built-in Error class but we have created our custom error class.

  const err = new Error(`Can't find ${req.originalUrl} on this server.`);
  err.status = 'fail';
  err.statusCode = 404;

  Now we are going to create the appError object from AppError class, right in the parentheses of next() .*/

  /* Now we must use next() in a special way. Because we need to pass that err object into next() .
  * Learn: If the next function receives an argument, no matter what is that argument, express will automatically know
  *  that there was an error. So it will assume that whatever we pass into next() is gonna be an error and this concept
  *  applies to every next function in every single middleware ANYWHERE in our app.
  *  SO AGAIN: Whenever we pass anything into next() , express will assume that it is an error in the parentheses of next() and
  *  it will SKIP ALL OTHER MIDDLEWARES in the middleware stack and send that arg(error) which is in next(), to our global
  *  error handling middleware.
  *
  * So now if the user tries to find a route that is not defined in our app, this middleware will catch that error and it will
  * create err object with it's properties and send it to our global error handler middleware.
  *
  * Now we can go ahead and implement this snippet in this middleware which we create the err object and then call next(err) in all
  * of our middlewares that have OLD error handling mechanism and renew them with this new approach. But it's better to create
  * our own Error class. So with that, we don't have to write all of that new snippet code for errors like in this middleware.
  * Now I created appError.js .*/
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

/* Here we want to define a global error handler middleware function.So in parentheses of app.use() in here, we need to give 4 args and
express will then automatically recognize this middleware as an error handling middleware and therefore express will only call this
middleware when there's an error.
In this specific middleware, in parentheses of .use() the first arg MUST be the error arg and then in sequence: req, res, next

In this middleware, we must read the status code from the error object. Because in this middleware, we don't know what was the
error status code? Right? It might be 400(bad request) or 404 or... . So when we create that error, in there we will define a property called
statusCode and in this middleware, we will get that statusCode property from err object and if there was the statusCode prop, well
we just let it be there(why create a new variable, huh?!), but if there wasn't, we will consider a default statusCode(500- means
internal server error) and save it on err object and in statusCode prop on that error.
Why we defined a default statusCode? Because there might be errors that aren't coming from our code, because there are gonna be
errors without a status code, so because they haven't a statusCode, they weren't created by us but they were created in some other
places in the node application
and in the same way, we would have status property on err object, if we define that error object in our code but if there isn't any
status property on err object, therefore it was came from other places so we need to give it a default value.

Remember: When we have 400 status code, it means 'fail' so status would be 'fail' and if we have status code of 500 it means 'error'.
For example when we have 404, we have 'fail' status.

* After creating this global error handler middleware, we must comment out the error snippets from our previous middlewares.
*
* Now we want to export this handler in this middleware. Because in future we're gonna build a couple of different functions
* for handling different types of errors. So we want all of those functions to all of them be in a same file and we can say
* that all of these functions are handlers or we also call them controllers in context of mvc. So let's create an errorController
* file.
* You could say: Hey we create controllers just for our resources and not anything else! But, at the end of the day, the functions
* that would be in errorController file, they are kinda for CONTROLLING our errors.
*
* So now let's comment our these codes because we exported it and it's in another file.
*
* app.use((err, req, res, next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});
*
* Important: We shouldn't CALL the external function(other middlewares) inside app.use() . So if you have created a function you shouldn't use
*  () for calling that function inside app.use() . So when you want to CALL a middleware inside app.use() you must do it without it's
*  parentheses, in parentheses of app.use() or app.METHOD() . So we shouldn't manually call the globalErrorHandler function here by saying
*  globalErrorHandler() therefore express itself must call this function, as soon as we have an error.
*  */

app.use(globalErrorHandler);

/* Now how we connect this new router with our application? We will use it as middleware and this is because this new modular tool router (tourRouter
variable), is actually a real middleware. So we can create a app.use() for these routers and say we want to add this middleware to
our application or middleware stack on '/api/v1/tours' route.
Important: So by using this app.use() and specifying the route in first arg, we can specify WHERE we want to add this middleware to
 our app (middleware stack).
So we want to use the tourRouter middleware for a specific route that is specified in first arg of app.use().
Learn: So if you specify a route (URL like thing!) in first arg of app.use(), the middleware that is specified in second arg would be
 used in that exact URL and not anywhere else. So with this, we created a sub application. Now we must change the url in .route() methods
 relative or based on url we used in first arg of middleware.
 Now why we must change those urls? Because the '/api/v1/tours' is already in the parent route of our mini application. So we just
 specify the additional or continuation of the url in .route() methods.

* Now when a request goes into the middleware stack and after that if it's url hits '/api/v1/tours' url, the tourRouter middleware function
* will run. So the tourRouter is a sub application which has it's own routes and if the request was for / , the http methods for '/api/v1/tours'
* would run and if the request was for /:id the http methods for '/api/v1/tours/:id' would run. So '/:id' in sub application means:
* '<entire route>/:id'
*
* So mounting a new router on a route is called mounting router.
* Remember: First you have to create the router variable and THEN use app.use() to use that router to create sub applications. So we can not use
* routers before we declare them.
*
* Important: You could place app.use() middlewares after defining the routes. So after codes like tourRouter.rote()... or userRouter..... ,
*  you could place app.use(...) . But YOU MUST PLACE app.use() codes AFTER DEFINING THE ROUTER VARIABLES. Because you must initialize the router
*  variable before using it.
 It's better so separate routers into different files. So we should cut
tourRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);
and any other router and take it to it's separate file. Also we take the route handler functions and take them to those separate router files too.
But we will also create a separate file for each resource route handlers functions too.
 For example : app.use('/api/v1/tours', tourRouter) means: mounting the routers (like tourRouter) on different routes(like '/api/v1/tours').
* Learn: Each router is kind of mini sub-application for each resource.
 By separating routers into different files like tourRoutes.js and ... , now each of those files is one small sub application.For
* example: We have one tour application and one user application and then we put everything together in our global app.js file. By
* importing the routers (like userRouter and ...) and then mounting those routers on different routes.
* So we created different routers for each different resources to have a nice separation of concern between the resources.So basically create
* one small application for each of them and then put everything together in one main app.js file.
* Important: This app.js file is mainly used for middleware declarations. So we have all our middlewares that we want to apply to ALL
*  of the routes and then also we have some middlewares that will apply for some specific routes only, in this main file.
* Learn: So tourRouter and ... are routers and also are middlewares and because of they're middlewares, we can use app.use() in order to mount
*  them.
* After that we must cut the route handler functions and take them to controllers folder.
* Important: In MVC architecure, the route handler functions are called controllers.So we put them in controller files.
Learn: In MVC structure, we start by receiving a request in app.js file, and then this request depending on the it's requested route
 (the resource that it wants), enters one of our routers and then depending on the requested route(url), the router will execute
 one of the controllers and that's where finally the response gets sent and finishing the request-response cycle.

   After all of this we have to create server.js file too. We create this file, because it's a good practice to have everything
   that is related to express, in one file (app.js) and then everything is related to the server in another main file.
   So server.js will be our starting file where everything starts and it's there we listen to our server.
   For using app variable in server.js file, first we must export this variable from app.js and then import it in that file.
   The database configuration, error handling, environment variables would be in server.js . So server.js would be kind of
   entry point.
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
