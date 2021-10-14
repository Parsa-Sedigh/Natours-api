/* 111-1. Section Intro:


112-2. Debugging Node.js with ndb:
There are different ways of debugging nodejs code, for example we could use vscode for that, but google released an amazing tool called NDB.

NDB (node debugger): Is a npm package. So npm i ndb --global (you should install it as a global package and on mac, you need global permissions).
But if you want to install it locally, you can install it as a dev dependency.
After installation add a new script in package.json and call it debug and that script would be sth like: "ndb <entry point file>" and this is gonna work
no matter if you installed ndb locally or globally. Now you can run this script instead of nodemon, because ndb will start the server
as well and it would then try to do this in the same port of nodemon command so it's not gonna work. So we need to finish the command that
is currently running and then run debug script.

Then a new chrome window should open, which is called a headless chrome, but it's not a real chrome.

There, on left side, we have our complete file system, down there, we also have access to our npm scripts which we can actually run from there.
We also have a console tab up there and there, you can see your server's console.

We can click on files on left side and edit them, right in the debugger. So for example let's say that we find a bug and we then want to fix it
right away and we can do that right in the debugger and it will then update the original code in your IDE.

In ndb we can set a breakpoint on one of our route handler functions and then send the request to the route that this function is
responsible for it and see the variables in it.
So we find out that when we set a breakpoint on a line of code, our code will stop running at that line where we defined a breakpoint.
In other words our code will froze or stuck at that point. We can define breakpoints in debugger, where our code will then then stop running
and it will basically freeze in time and we can then take a look at all our variables.

When you set a breakpoint, you can see it on right side on the breakpoints tab as well.
Now our app is already running at this point and it's waiting for reqs to come in and now we can right click on the ndb window and then
click on 'Run this script' and it will then run the script again and then on the right side, that it says 'Paused on breakpoint' and so
all the code that is above that breakpoint, has already executed at this point and so we can now take a look at the variables by:
1) hovering on them.
2) at the end of each line, the values of variables are also shown
3) on the right side and in Scope panel

In Scope panel, you can also see the five variables that we have access to in all modules. Like: __dirname, __filename, require(), module,
exports, so these are the five variables that are available in eaach and every module and actually, when we execute the code like this(in the
debugger), we can see that our entire code is in fact wrapped into a function which is:
function (exports, require, module, __filename, __dirname) {<our code>}
So this wrapper function that gives us access to those five variables.

You notice that in app variable(which is basically the express application that we export from app.js) which is the express application variable,
we have a function(method) called _router and it has a property called stack which is the middleware stack that we have in our application.
There, we have some <anonymous> middlewares which are probably the middlewares that we created ourselves, like a middleware that has only
a log in it that says: "Hello from the middleware" and another one is the middleware that sets a requestTime property on req object.
Also you can see our routers there and inside each of them, you can see a property called regexp that specifies the route for which it applies.
So with this, we can see how an express application works behind the scenes.

In Global variables,(on right side), we have the process variable which is available everywhere and there we have process.env which is where
all our environmemt variables are stored.

So if a user just sends a request to api, if that line must be executed in order to send a response to the user, it won't and simply
the user won't get any response and request-response cycle will stuck at that line.
Now if you want to resume the execution of code after that breakpoint, you can use F8 (run script execution) button.
Which will continue the execution of code until next breakpoint(if there isn't any breakpoint after this breakpoint, it will run
the code till end.) and if there is no more breakpoint, our app would be really running.

You can set a breakpoint at the res.status(200)... line of the handler function that you will send a req to it, to see the variable values there.

So with debugger and breakpoint and seeing the value of variables, we can freeze our code in time, instead of using a lot of console.log()s.

if you pause the execution with a breakpoint and after some time, you resume the execution, in postman, the Time, would show all of the time that
it was hanging around and was waiting to get the response!

Learn: Remember that when you set a breakpoint earlier in the code , if you for example send a request to where the code that has a
 breakpoint must run, the response won't back until you remove that breakpoint. Because we basically stop the execution of further code in
 breakpoints. Right?

For checking if a function works correctly or not, you can set a breakpoint on where that function would be called and then step into it to
see the values, so if you want to see the values in limitFields function, set a breakpoint on the line that the limitFields gets called, so
on the line that we have limitFields() and after triggering that breakpoint, we know that all the lines before that breakpoint are already
executed and now we can use the step tool, so you can use step(F9) button to go to next line that gets executed, by each click on that button.
In ndb, the step tool will execute the next line of code after breakpoint. For example if our breakpoint was on this line:
...
.limitFields()
...
After finding the bug, you can correct the bug right in the debugger and then save and then it will come back to some lines before, so you
can hit step button to get to the line that the error happened previously to see the new value of that variable that had error.

You can also step our of the current function too, with it's specific button in step tools.

If we use step, the next line is the code that is inside the limitFields() method. So with using step tool on this breakpoint, we will
go to the first line of that method (the lines that this method has defined)*/
/* 113-3. Handling Unhandled Routes:
Let's first write a handler for undefined routes. So basically for the routes that we didn't assign any route handler function yet.
Currently, for a route that we don't handle it with a handler, if we send a req to it, we would get error in format of a html !!! So express
automatically sends that html code which it's main content is "Cannot GET <requested route>" along with a 404 not found status error code
in case that there is not any handler for the route that was requested.
Now there's also another situation, which is if we send a request to a route that accepts a route param but we didn't send that expected
route param but sth very different, this is also another situation that we need to handle.
For example: Let's say we have a route that accepts a req param like: 127.0.0.1:3000/api/v1/tours/:tourId , but in request, we send:
127.0.0.1:3000/api/v1/tours/qwerty , now the res says:
{
  ...
  "message": "Cast to ObjectId failed for value \"qwerty\" at path \"_id\" for model \"Tour\""
  "name": "CastError",
  "stringValue": "\"qwerty\"",
  "kind": "ObjectId"
}
So mongodb in this case is basically trying to find a document with that "qwerty" id, but cannot convert it to a valid mongodb ObjectId. So again,
this is a different situation. But for now, let's work on that former situation where we get error in html format.

Remember: For error handling in API context, it doesn't make sense to send back HTML! So we must create a handler function
for all of the routes that are NOT catched by our routers.

Important: The app.js file is the definition of our express application.

Now how are we gonna implement a route handler for a route that was not catched by any of our other route handlers?
Solution: We know that all of the middleware functions are executed in order that they are in the code. So the idea is if we have a
request that makes it into this part of our code (after those middlewares for our ACTUAL routes-section 3), so after the
app.use('route', <related router or related mini application>)s in app.js (so it got passed all those route middlewares in app.js),
that it means that neither tourRouter nor the userRouter, were able to catch that request. So it has a strange or unacceptable route.
So if we add a middleware after those routers, it will only reached if was not handled by any of other routers.

Now let's specify this middleware which is a route handler middleware.
Now the question is what would be the http method of this route handler, get? post? ... ? Do we must write handlers for all of
these? No, we don't want to write handlers for all of the not handled http methods. We simply want to handle all the routes(urls) for all the
verbs(http methods), with one handler.
So we can use: app.all() So app.all() will run for all of the verbs (http methods) in the specified route.
Now we want to handle all the URLs that were not handled before, so we can use * which stands for 'everything'.
So as you can see, for the second arg of app.all() or app.use() or app.get() or... , which is the handler function, we can declare
the function right there, or we can just name the function (kinda reference it-like what we did in our routes files).
Now let's send a regular 404 jsend formatted response there.

Again: If the request was able to reach until this point, it means that the request-response cycle was not yet finished at this point in
our code.Because remember that middleware is added to the middleware stack, in the order that it's defined in our code, so the first middleware
always runs first and so if the route was matched in our tourRouter which is for the FIRST middleware in app.js , then, our req would never even
reach that app.all() middleware, therefore that app.all() would not get executed, so that app.all() should be the last part after all our
other routes.

req.originalUrl is the url that user was requested it.

Important: Sending a response to user, (like res.status.json() or res.send() or ...) won't stop your middleware stack IF YOU CALL next() .
 BUUUUUUUUUUUUUUT!!!!! When you want to end the app from further execution in the middleware, you shouldn't use next() to actually end
 the request-response cycle. Right? Like what we did here. So here we want to end the app from running further for execution code. So we
 didn't call next() .

If we put this middleware on top of all of our other middlewares for handling routes, no matter what request we send to server, it
will always run this middleware, because our req would always now reach that first route handler and it's actually matched, because
it matches all http verbs no matter what is it's url and therefore, it will say: Can't find this route!!! Even if we send a valid request to
a valid route! Because the request would go to this middleware and send back to user and no other code would be executed.*/
/* 114-4. An Overview of Error Handling:
We need to handle our errors in a central place in our app. What we did up until this point, was to simply send back an error
message as JSON in EACH route handler in case something went wrong.

Error handling in express: an overview
Two types of errors that can occur:
Operational errors and programming errors.

Operational errors are problems that we can predict that they will inevitably happen at some point in future, so we need to
handle them in advance. They have nothing to do with bugs in our code, instead, they depend on the user, or the system or the network.
So things like a user accessing an invalid route, inputting invalid data, or our application failing to connect to the database. All these are
operational errors that we will need to handle in order to prepare our application for these cases. You will also see the term "exception" being used
instead of error and while they are conceptually different, many people use the terms error and exception interchanbaely and we're just gonna
call them "errors" in this course as well, in order to avoid confusion.
These types of errors have nothing to do with bugs in our code. Instead they depend on user or the system or the network. For example:
user accessing an invalid route
invalid inputted data from user(validator error from mongoose)
failed to connect to server
failed to connect to database
request timeout and ...

We need to handle these errors in order to prepare our application for these cases.

On the other hand, we have programming errors, which are simply bugs that we developers introduce into our code, like:
Reading properties from an undefined variable
Passing a number where an object is expected
using await without async
using req.query instead of req.body and ...

These erros are really inevitable but also more difficult to find and to handle.

When we're talking about error handling with express, we mainly just mean operational errors. Because these are the ones that are
easy to catch and to handle, with our express app and express actually comes with error handling out of the box. So all we have to do
is to write a global express error handling middleware middleware which will then catch errors that are coming from all over the
application. So no matter if it's an error that is coming from a route handler function or a model validator or really someplace else , the goal is
that all of these errors end up in one central error handling middleware. So with this, we can send a nice response back to
the client and letting them know what happened. So really, handling in this case, just means sending a response letting the user know what
happened, but handling can also mean, in other cases, retrying the operation or crashing the server, or just ignoring the error altogether. Sometimes,
that's just the best option.

The beauty of having a global error handling middleware is that it allows us for a nice separation of concerns. So we don't have to
worry about error handling in our business logic or in our controllers or really anywhere else in our app. Instead we can simply
send the errors down to the error handler which will then decide what to do with those errors.*/
/* 115-5. Implementing a Global Error Handling Middleware:
The goal is to write a middleware function which is gonna be able to handle operational errors like when a user hits a url that doesn't exist,
we can consider that an operational error and we in this case handle it by sending back a res.status(404).json() , but the goal is to do that
in one central place. All over the place we have this snippet(res.status(404).json(...)) which handle errors.

Now we want to define a global error handler middleware function. Express already comes with middleware handlers out of the box.
Now in parentheses of app.use() in app.js(we will take it to another file later),to define an error handling middleware, all we need to,
is to give the middleware function, 4 args and express will then automatically recognize this middleware as an error handling middleware
and therefore express will only call this middleware when there's an error.
So just like in many other cases, this middleware function is an error first function, which means that the first argument is the error and then
we have req, res and next.
In this specific middleware, in parentheses of .use() the first arg MUST be the error arg and then in sequence: req, res, next

So by specifying four params, express automatically knows that this entire function that we passed to app.use() , is an error handling middleware.

Also to trigger this error handler middleware, we need to somehow create an error so that this middleware function is actually caught.

So two steps, first we create the middleware, then in the second step, we will actually create an error so that that function(error handler
middleware) will get caught.

In this middleware, we must read the status code from the error object. Because in this middleware, we don't know what was the
error status code? Right? It might be 400(bad request) or 404 or... . So when we create that error, in there we will define a property called
statusCode and in this middleware, we will get that statusCode property from err object and if there was the statusCode prop, well
we just let it be there(why create a new variable, huh?!), but if there wasn't, we will consider a default statusCode(500- means
internal server error) and save it on err object and in statusCode prop on that error.
Why we defined a default statusCode? Because there might be errors that aren't coming from our code, because there are gonna be
errors without a status code, so because they haven't a statusCode in the time we are in that error handler middleware, it means they weren't
created by us but they were created in some other places in the node application and in the same way, we would have status property on err object,
if we define that error object in our code but if there isn't any status property on err object, therefore it was came from other places so we
need to give it a default value.

Remember: When we have 400 statusCode, it means 'fail' so status would be 'fail' and if we have statusCode of 500 it means 'error'.
For example when we have 404, the value of status is 'fail'.

After creating this global error handler middleware, we must comment out the error snippets from our previous middlewares.

I commented out the codes in that global middleware for catching unhandled routes, because now we handle all of the operational errors of application,
with one global error handler middleware. So let's create the err object, which that global error handler middleware needs.

Now we want to create an error with the built-in Error() constructor.

In Error() constructor we can pass a string and that string will be the err.message property in global error handler middleware.
EX)
const err = new Error(`Can't find ${req.originalUrl} on this server.`);
err.status = 'fail';
err.statusCode = 404;

Learn: After constructing a new Error object from Error() constructor, you can add properties to this constructed error object like status or
 statusCode properties and ... , just by saying:
 EX) const err = new Error(<the message property value of err object>);
 err.<arbitray property> = <value>;
 So we define the err.message property automatically by passing a string to Error() constructor and THEN, we can add new properties to this
 newly created err object, manually.
So we defined these properies on err object, so that our error handling middleware can then use them in the next step.

But now, how do we actually REACH that next step(next middleware) that I mentioned?
As always, we use next() , but this time we use next() in a special way.
Because now we need to pass that err object into next() .
Learn: If the next() function receives an argument, no matter what is that argument, express will automatically know
 that there was an error. So it will assume that whatever we pass into next() is gonna be an error and this concept
 applies to every next function in every single middleware ANYWHERE in our app.
 SO AGAIN: Whenever we pass anything into next() , express will assume that it is an error in the parentheses of next() and
 it will SKIP ALL OTHER MIDDLEWARES in the middleware stack and send that arg(error) which is in next(), to our global
 error handling middleware, which will then of course, be executed.
So now if we pass that err object to next() , it makes the next() to skip all other middlewares in the middleware stack and go straight to the
global error handler middleware.

So now if the user tries to find a route that is not defined in our app, this middleware will catch that error and it will
create err object with it's properties and send it to our global error handler middleware.

Now we COULD go ahead and implement this snippet in this middleware which we create the err object from Error() and then call next(err) in all
of our middlewares(route handlers) that have OLD error handling mechanism(which is by sending the res.status.json() themselves) and renew them with
this new approach. So replacing res.status().json(...) with:
const err = new Error('...')
err.status = ...
err.statusCode = ...
next(err);

But it's better to create our own Error class. So with that, we don't have to write all of that NEW snippet code that I wrote above and instead have
a more streamlined class of ourself. */
/* 116-6. Better Errors and Refactoring:
Now I created appError.js in utilities folder.

We want all of our appError objects to inherit from the built-in Error class. So let's extend the built-in Error class by
our new class(AppError).

Important: In parentheses of constructor() we specify what we're gonna pass into a new object created from that class that we're writing constructor() for
 it.
The constructor() method is called each time that we create a new object out of this class.

Important: When we extend a parent class(in this case, the parent class is Error), we call super() in constructor of our new
 class, in order to call parent constructor.
We called super() by passing it an arg, because the message is actually the only parameter that the built-in Error class accepts.
So when we call super() , we need to pass in the args of construcotr() of parent class to super() . So there, calling super(message); is basically
like calling the Error() itself.

In class1 extends class2 , class1 inherits from the class2.

The status can be either 'fail' or 'error' in our app and we COULD pass that into the object, so we could sayL this.status = status; but it's
also not really necessary. Because the status depends on the statusCode property. For example when the statusCode is 400,
then the status would be 'fail' and if statusCode is 500, status would be 'error'.

So we can test the first number of statusCode for the value of status. In JS, we have startsWith() method that we can call
on strings. But the statusCode might be a number(maybe when we call this class in our code, we pass it statusCode in number),
so we must consider this situation and convert statusCode to string whether we pass statusCode in staring or number.Because the
startsWith() method is only for strings. For convert statusCode to string, we use it in template string.
We wrote status property by using a ternary operator BASED ON THE VALUE OF statusCode, so with this we won't need to pass in
status as a separate argument to this class. So we can find out the value of status based on statusCode and therefore we
don't need to pass in another arg to this class when we want to create an object from this class by calculating status value
based on passed in statusCode(so this saves us from manually have to pass in to appError() class another argument which would be
either 'fail' or 'error', because we calculate it ourselves inside the class itself).

All the errors that we will create using this class, will all be operational errors (errors that we can predict will happen at
some point at the future, like a user creating a tour without the required fields).
So again: From now on, instead of using built-in Error class, we use appError class, in order to create the errors
in our app. These errors will be operational errors(so we need an indicator for this set to true for all of them, because all of them created
from this class will be operationl errors), so let's create a isOperational prop and set it to true. So all of error objects that created
from this class will have this prop and it's set to true.
We create this property, so later, we can TEST for this property in the err objects and ONLY send error
messages which are operational errors and which means they were created from this class and this is useful, back to the client and this process is
useful because some other crazy and unexpected errors that might happen in our app, for example a programming error or some bug
in one of the packages that we require into our app and these errors will of course not have isOperational prop.Because they didn't
created by our custom error class. So isOperational property shows that the err object is a custom err object and didn't produced
by the system.

Now we need to capture the stack trace. Actually each err object has the `stack` property on it, so err.stack basically
shows us where the error and also where it happened and it also shows us the entire call stack which in the end, originated by the error(by that
new Error()).
So we kind of want to preserve that call stack and also at the same time, not add this custom class(appError) to that stack track.
So we say: Error.captureStackTrace() and in parentheses of the prior code, we specify the CURRENT OBJECT WHICH IS `this` keyword in this case and
also AppError CLASS ITSELF, WHICH IS this.constructor . So with these code, when a new object is created from this class and therefore
when the constructor function is called, then that function call is not gonna appear in the stack trace and won't pollute the
stack trace.

Why we didn't say: this.message = message; ?
Because by calling the parent class(Error class) constructor by saying super(message)
and whatever we pass into the Error class, is gonna be the message property. So basically by doing super(message) ,
we already set the message property to our incoming message. So the Error class has the message property and we are extending
that class so we have that message property too! without defining it in our class definition and by calling super(message) ,
we are setting the value of incoming message to the message property.

Now comment out the const error = new Error('')...
in that app.all() middleware, because we want to use the new AppError() class.

Now we are going to create the appError object from AppError class, right in the parentheses of next()

Now we want to export that global error handler in that app.use() middleware. Because in future we're gonna build a couple of different functions
for handling different types of errors. So we want all of those functions to all of them be in a same file and we can say
that all of these functions are handlers or we also call them controllers in the context of mvc. So let's create an errorController
file.
You could say: Hey we create controllers just for our resources and not anything else! But, at the end of the day, the functions
that would be in errorController file, they are kinda for CONTROLLING our errors.

In that errorController.js file, we just gonna export that global error handler function. Because other functions
would be like helper functions and we won't export them, so we used module.exports for that global error handler function.

So now let's comment out those codes because we exported it and it's in another file.

Now import that global error handler in app.js as globalErrorHandler name.*/
/* 117-7. Catching Errors in Async Functions:
A better way of catching errors in all our async functions:
Right now, in all of our async functions, we have try {}catch() {} blocks. Because that is how we usually catch errors inside of an
async function by using a try catch block. But that makes our code messy. So for example, the goal of a function like createTour is
to just execute a code that creates a tour and then send the response, not mess around with error handling. But we are using try catch blocks which are
for error handling and this is not good, our code is not focused. Also we have a lot of duplicate code because in each of our handlers, we have quite a
similar catch block. So in all of those blocks, all we're doing is to send an error or fail response and that response would actually
not even be sent here and it but, be sent from our global error handling middleware(but this is another topic). So we need 2 things to fix.
But first let's fix those try catch blocks in our async functions because they aren't ideal. The solution is to take out try catch
block, out of the async functions and put them on a higher level in another function. So basically what we're gonna do is to
create a function and then wrap the async functions which are using try catch blocks into that newly created function and that function
is catchAsync .We called it like this, because the goal of this function is to simply catch our async errors and inside this function
we will pass in a function.
After creating catchAsync function, we will wrap all of the definitions of the functions that we want to pass in to this catchAsync
function. Because well, as I said we must pass in a function to catchAsync function.

Question: When we're calling fn() in the catchAsync() function, how we call the incoming function (fn) by passing it req, res and next?
Why we actually have access to req, res and next inside catchAsync() ? Right now, we haven't req,res and next inside catchAsync() function
But we will fix that.

Important: Right now if any of your middlewares in tourController or userController doesn't have the next parameter. Pass it to them.
 Because we need to call next(), in order to pass the error into () of next() and therefore the error could go to our global error handler middleware
 by calling that next(error) with error inside it's parentheses.
 So all of those functions are gonna need req, res and next as their args.

Now, as you can see we're passing an async function to catchAsync() function and we're calling that async function inside of catchAsync(), fn .
So the fn function in catchAsync() is an async function and rememeber that async functions return promises and when there is an error inside
of an ansync function, that basically means that the promise gets rejected and so in catchAsync() function where we actually call that function by
saying fn(), we can then catch that error by attaching catch() to it. So we catch it there(in catchAsync()) instead of catching it in the try catch
block.

But as you know, when we want to call an async function, we must await for it. Right? We can't just simply call the async function like
asyncFunction() . We must use .then() and await for it.

After using .catch() on calling the incoming function, we can remove try catch blocks and just hold the code that is inside
try block. Because again, the code that is inside catch blocks, transferred to fn(...).catch(...) in the catchAsync() function.
In catchAsync() function, it's easier to use .catch() on returned promise of fn(...) than using catch(err) {...} block.
In other words, we transformed catch block into a .catch() method on returned promise.

Now there are actually two big problems and it wouldn't really work at all:
First is that fn(req, res, next) has no way of knowing req and res and next. So right now
the incoming function or fn don't know what is req, res and next. Because we did not pass them into catchAsync function therefore
there's really no way for fn function to know these variables and their values.

The second problem is when we are calling catchAsync using parentheses, inside of catchAsync function definition itself, we are RIGHT AWAY calling
that incoming function which is named fn and that's not how it is supposed to work. So createTour() function should be really a function but not
the result of calling another function. (As you can see the createTour function is result of calling catchAsync(createTour function definition)
) . So the createTour() function shouldn't be called and instead it should sit and wait until express calls it and we know that
express will call this function as soon as someone hit the route that needs this createTour function to be executed.

Again in other words, we are calling createTour() function manually by calling it by another function which is catchAsync() and pass
createTour function into catchAsync() which this catchAsync() function would call createTour() (basically catchAsync function would
call any function that we pass that function to it and in this case that function we pass to catchAsync is createTour and therefore
createTour would be called manually by us and that's not good because we want to express itself called createTour function not us!)
and this isn't good.
The solution is to make catchAsync() function return another function which would be assigned to createTour and that returned function from
catchAsync, can then later be called WHEN IT'S NECESSARY BY EXPRESS. In other words that returned function from catchAsync
is gonna be the function that express would call when necessary. So in catchAsync let's say:
return (req, res, next) => {
TODO ???????? I don't understand
}
So this anonymous returned function is the function that express is then gonna call, so we can specify req, res and next, so that express itself
can then bring the values of these 3 args, when a route hits the related controller.

Learn: we can simplify err=> next(err) with next. So it would be :
 return (req, res, next) => {
 fn(req, res, next)
        .catch(next);
 }
So now the next function that we passed to catch() , will be called automatically with the parameter that that callback(that we had before) receives.

Recap: In order to get rid of try catch blocks in controller functions, we wrapped createTour async function inside of catchAsync() function
that we just created.The catchAsync() function will then return a new anonymous function and this anonymous function will be
assigned to createTour function and this new anonymous function will then called as soon as the new tour should be created
using the createTour handler function and that's why this new anonymous function has the exact signature as createTour function.
Why is assigned to createTour() ? Because we called catchAsync() and catchAsync() returns an anonymous function that receives req and res and next
which would be provided by express and it has a catch() block assigned to it.

Signature means: (req, res, next) . Now what this new anonymous function will then do is that it will call the function that
we passed to catchAsync() (in our case that function we passed was createTour) and then it will execute all the code of that
passed in function and since the passed in function is an async function, it will return a promise and therefore in case there's an error
in that returned promise, or in other words, in case that promise gets rejected, we can then catch that error using the catch method which is
available on all promises and in the end, that is the catch() method which will pass the error of createTour function into the next
function, which will then make it so that our error will end up in our global error handling middleware.
So this line of code is where all the magic happens:
EX) fn(req, res, next).catch(next);
and this is in fact, what allows us to get rid of the catch block that we had previously.
In this catch() , the error will be propagated, so it will be catched by our global error handling middleware which then sends the error response
back to client.

The reason of creating the catchAsync function is to catch all of the errors of our handler functions in one place and not catch
the error of each function in itself and therefore have bunch of catch blocks which all of them are doing kind of same work which is
to get the operational errors of that handler. So we transfer all of these catch snippets into one function which is called catchAsync.
Now why we must pass in the entire function to catchAsync function? Because we want to simply call it inside the returned anonymous function obviously!

Now we need to wrap all handlers inside catchAsync() and then get rid of try catch blocks. Then add next arg to all of the handlers because we need it
in catchAsync() in case there was an error that needs to be propagated to global error handler middleware.

So now if we create a new tour and then some errors happen, then that error should catched in the catch method inside of catchAsync()
function and the error will sent to our global error handling middleware and that middleware will send back the response.

Now if we try to create a new tour with some errors, for example don't send all of the required fields for creating a tour,
we will get back a 500 internal server error for statusCode because the error that just sent to the error handler middleware, didn't
have any statusCode property. So we must fix that.
Now let's export the catchAsync function into it's own file.

Currently if there is an error in a controller, there is no statusCode property on error object, because those errors actually come from mongoose
and so we have no way of adding a status code to those errors, ACTAULLY we COULD do it, but that would just be even more confusing and so we're
gonna find another way.
So currently, we would always send back the 500 error status code instead of the suitable error status code.*/
/* 118-8. Adding 404 Not Found Errors:
Let's now make some more use of our AppError class by adding a couple of 404 errors in some of our tour handler functions.

Note: We COULD have used the catchAsync() function also in our router.

We could wrap the route handler functions inside catchAsync(), right in the route files instead of wrapping them in controller
files and that would have the same result. For example:
router.route('/tour-stats').get(catchAsync(tourController.getTourStats));
and this would have had the exact same result, but we didn't do it this way, because if we use this approach, we have to
remember which of these functions that are listed as routers in tourRoutes.js are ASYNC functions.
Because remember we use catchAsync() function on async functions, right?
Now in this case, actually all of them are async function and so we wouldn't need to remember that they are whetehr asybnc or not in this case,
but there will be some examples later where not all the handlers are async functions and so in that case, we would really have to remember
which of them I have to wrap into catchAsync() and which ones not and so doing it in the controller files, is much easier because simply each
time we're writing an async function there, then we already know well, I need to wrap it into catchAsync() . So we don't do it in the routes files.
So if you wrap a function that is not async into catchAsync() , it would make bugs.

Now we want to implement 404 error. Because for example when someone enters a weird ObjectId(not a valid ObjectId at all) like 'ddff' in url for getting a tour,
of course he would get an error that says: cast to ObjectId failed which means mongoose could not convert that url parameter into a valid id
for mongodb. But when someone enters a valid ObjectId but that ObjectId doesn't
exist in our database, the result of our api would be:"tour": null . which is not good.We want it to show a 404 status code instead of 200 and say:
this tour was not found. So we must add some stuff to getTour handler function. It would be: if(!tour) {...}
So because we get back a null in result, we can test for falsy tour, so !tour in our code(in JS, null is a falsy value, which means it's a
value that will convert to false, in an if statement) and we used next(<error>) in that if statement, in order to jump straight into our
error handling middleware and not run the middle middlewares. We also need to use return with that new AppError() in that if statmeent.
Because we don't want to execute any further code after creating this error. So because we want to return the function that we're in it, immediately
and not move on to the next line of that function anymore, otherwise we would try to send two responses!
As soon as next() receives something, it assumes that is an error and will jump straight into global error handling
middleware which this middleware will send the response from our API.

In JS, null is a falsey value or in other words a value that will convert to false. So if there is no tour, we want
to just straight into our global error handler middleware. So we must use next(error) .

Now if we try to create a new tour with some errors, for example don't send all of the required fields for creating a tour,
we will get back a 500 internal server error for statusCode because the error that just sent to the error handler middleware, didn't
have any statusCode property. So we must fix that.
Now let's export the catchAsync function into it's own file.

So we create an error using AppError class and we then pass that error into next() and as soon as next() receives sth, it assumes it is an error
and it will jump straight into the global error handling middleware which will then send the response for us.

So let's create that if statement which checks for `!tour` and paste it into all the other handlers that query docs based on the id, like updateTour()
so there is the same, if we're trying to update the tour that doesn't exist, it will then give us the exact same error.

Why we didn't use
if (!tour) {
return next(new AppError('No tour found with that ID.', 404));
}
In getAllTours handler function?
When there is 0 results found, for example there are no results matching for a filter or because the page was requested that doesn't
exist, then of course we COULD consider sending a 404 error and saying that the data was not found. But that error is not
entirely correct in this specific request. Because there was not really an error. I mean the request was correctly received and then
the database correctly searched for the tours and found 0 results and so these 0 records are exactly what we're gonna send back along
with 200 HTTP status code. So again we consider there can't be really an error, when a user requests ALL of the tours. Unless of course
there are some failures in the database or something like that and in those cases mongoose will AUTOMATICALLY throw an error which
would catched by our catchAsync function which it's responsibility is to catch errors of our functions in one place instead of
writing catch blocks in each of our functions and then catchAsync function would send that error to our global handling middleware
by saying next(err) .*/
/* 119-9. Errors During Development vs Production:
We need to send different error messages for development and production environments. Currently, we're sending the same response message in
errorController, basically to everyone, no matter if we're in development or in production. But the idea is that in production we want to
leak as little information about our errors to the client as possible. So in production, we only want to send like a nice human-friendly
message so that the user knows what's wrong. But on the other hand, when we're in development, we want to get as much information
about the error that occurred as possible and we want that information right in the error message which is coming back. Also
we could log the information to the console, but I think it's way more useful to have that information right in postman in this case.
For distinguishing between development and production modes for executing some code we say:
if (process.env.NODE_ENV === 'development') {
  ...
} else if (process.env.NODE_ENV === 'development') {

}

So in errorController.js , we check if we are in development mode, we send back some more detailed error response but if
we are in production, we would send a simpler error or fail response to the client(if we have an error of course!).
Important: So it's important to send one type of response error to client in development mode and another simpler type of response error or
 fail error in production mode and we do that in errorController file.

Now let's create some functions for sending errors in that file. In those functions we need to args to pass to them. One is
the error itself and the second one is response. Why we need to pass response? Because for SENDING a response to the client we need
the res object that was provided by express. In other words all of the .status() and .json() methods that we want to send the
response, is actually available only on res object. So we need it in order to send the response.

In AppError class we mark all of the errors that WE create using AppError class, as operation errors, by giving those custom errors a property called
isOperational and set it to true. So all the errors that WE CREATE OURSELVES, would be operational errors and in fact, it's only these
operational errors that we want to send their err messages to the client, at least in production. On the other hand, when we have
a programming error or some other unknown error that comes from a third party package, we don't want to send any err message about
those kind of errors to the client in production. So this is why we created isOperational property, in the errorController file.
Important: When we're in PRODUCTION MODE, in situations we have error in programming or error in packages or ... ,
 (the errors that are not operational errors), we don't to send messages about the error and we just want to send a very generic
 error message to the client. So we use if(isOperational) when we want to send error responses in production mode. But for errors
 that aren't operational in production, for ourselves, we want to know an unexpected error happened, so we just log it to the console.
 But when we're in development mode, we want to have as much details about the error that just happened as possible in order to get
 rid of that error. It might be an programming error, so with those details we can get rid of bugs.

In else case of isOperatation check in sendErrorProd, we log the error to the console for ourselves, but for client, we don't expose much.
We have access to these logs in the host platform that we deploy our code. So we can keep looking at those logs and then in there,
we're gonna find those unexpected errors, so that we can then fix them.

There are real logging libraries on npm that we could use instead of simple console.error() , but this special log, will make
the error in console very visible.


Right now there are some errors, that maybe come from mongoose which we didn't mark as operational errors by setting isOperational
property on them. So they would have a response of: something went wrong! Because they aren't operational. So we didn't create
those errors by ourselves. BUT WE NEED TO MARK THEM AS OPERATIONAL ERRORS TOO, so by setting them to operational we can send an
appropriate error message for those kind of errors. Actually there are 2 or 3 other errors that we need to mark.

So we're distingusign between errors in development and in production, so when we're in production, we send the error using sendErrorDev function,
which will then send as many details as possible to the client, so that we really get all the information in order to get rid of the bug, if it's
a programming error or if it's an operational error, then we still really want to see anything that's going on.

When we're in production, then we distinguish between operational errors, so errors that we know and trust, and the other errors that might be kind of
unexpected. If the error is operational, so for example the user trying to access a route that doesn't exist, or trying to input invalid data,
all of these are operational errors(yeah, even in prod mode) and we can then send appropriate error messages for the client to know what went wonrg.
But on the other hand, we have unknown errors or unexpected errors and in that case, log that error(so we can see it) and then we simply say sth went wrong.

Now in order for this to work, right now there are errors that are for example coming from mongodb, which we do not mark as isOperational and so in
that case, they would currently simply be handled using that generic error message that says sth went wrong. For example a validation error.
Right now that's an error that's coming from mongoose and not from our OWN AppError class, because we don't create these errors by ourselves which means
with AppError class and so again, they are right now not marked as operational. But of course we NEED to mark them as operational, so that we can
then send the appropriate error message back to the client, for example "the input data is invalid" error message and there are two or three other
errors that we need to mark as operational OURSELVES and we will do that in: else if (process.env.NODE_ENV.trim() === 'production') {} block.*/
/* 120-10. Handling Invalid Database IDs:
There are 3 types of errors that might be created by mongoose and we need to mark them as operational errors. So by mark them as
operational errors, we can then send back meaningful error messages instead of generic error message, to clients in PRODUCTION,
in dev, we always send back meaningful error messages. Because when we're in production mode, if the error haven't isOperational property,
we would send a generic error message for it.
Now let's simulate those 3 errors.

First one is when we try an invalid id query param in getTour . Because this error is very common, so we
need to mark it as an operational error and send back a meaningful response instead of mongoose default response. So the goal is to
mark this error as an operational error and create a meaningful message, instead of sth like: "Cast to ObjectId ...", which doesn't mean
anything to the client and also has security risk. So we need to mark it as opertional and create a menaningful message. It's name property is
"CastError".

The second common error in mongoose, is when the user is trying to create a tour and he send a duplicate name value for the tour he wants to create.
So this error is very common and right now it hasn't a very meaningful error message. So we want to customize this error.

The third common error is also kind of related to validation, is when user wants to update a tour and he wants to update a tour
with ratingsAverage of 6! But the maximum ratingsAverage is 5 and it's name property is "ValidationError" We mark these errors as operational IN PRODUCTION.
Because in development it doesn't matter the error is an unexpected error or an error that is common and we customized it.
Because we want to get as much information about the error as possible.

Learn: For returning a meaningful error message for mongoose common errors, we can check the error.name property to figure out what is the
 kind of error and if it was a common mongoose error, we behave it like an operational error.

We're gonna pass the error that mongoose created, into handleCastErrorDB() function and this function will then return a new error which is
created with our AppError class and therefore that error would be marked as isOperational, because remember, all our AppError objects have the
isOperational property set to true automatically.

For converting a mongoose default error to our customized errors we call handleCastErrorDB() function to convert that kind of error
to our special errors that are created with AppError class and those errors would be marked as operational. Because remember, all of our
errors that created by AppError class, have isOperational property set to true. So handleCastErrorDB() would return that special error
so let's save the result of it to a variable(err).
Important: It's not a good practice to override the arguments of a function. In this case we are overriding the err argument.
 So instead of overriding err object, we can create a hard copy of that err object and we will use let and not const because we will
 reassign a new err later. For creating a hard copy of an object(in this case that object we want to create a hard copy from it is
 err object), first we must destructure that object we want to create a hard copy from it.
After destructuring err object, we use error object in furthur code.

Learn: In express, normal names of errors are err.

I called the arg of handleCastErrorDB function err instead of error, because it's kind of standard in express to name errors as err. Although
we're sending a hard copy of err object which is named error to this function, we named the argument of this function err instead
of error, because it's a standard in express to name errors, err.

The goal of that function is to convert a weird mongoose CastError to our customized and understandable error by using the
AppError class.

Learn: The errors that are coming from mongoose, (they aren't customized currently!) have a property called path, which is the
 name of the field for which the inputted data is in the wrong format. In other words, path field shows the field that had a wrong value in
 inputted data and that WRONG value for that field which has the wrong value is in `value` property.
 For example if the user requests a tour with wwww _id, the path property in err object would be _id and the value property in
 err object would be wwww.

Now let's handle the error that occurs when we try to create duplicate fields for fields that are supposed to have unique values.

By creating that function, we transform the wierd error that we were getting from mongoose , into an operational error with a nice friendly message
that human can read.

IMPORTANT: If you see that process.env.NODE_ENV is not equal to development or a string, it's probably it has some spaces.
 So look at your package.json (where you SET the NODE_ENV environment variable) , you must use:
 SET NODE_ENV=production&& nodemon server.js instead of "SET NODE_ENV=production && nodemon server.js"
 Because if you use the second one, the value of process.env.NODE_ENV becomes production + " " instead of production and the
 comparison of if (process.env.NODE_ENV === 'production') always returns false. But if you use the first one npm script,
 that comparison returns true. Also it's a good practice to use process.env.NODE_ENV.trim() when you want to do comparisons between
 process.env.NODE_ENV and production or development or ...
 You can trim() the value of process.env.NODE_ENV too, when you wanna compare it to a static value.*/
/* 121-11. Handling Duplicate Database Fields:
Now let's handle the error that occurs when we try to create duplicate fields for fields that they are supposed to be unique.
For example we try to create a tour with a name which that name exists. Currently the error that comes from this situation
doesn't have the name property and that's because it's actually not an ERROR that is caused by mongoose and it's caused by
underlying mongodb driver and what's we're gonna do to identify this error is to check the code property which would be 11000
in case of duplicated field which must be unique(because in this case we don't have the name property).
So now, let's create a function for the case that we want to check the error.code property and that function is named
handleDuplicateFieldsDB() . Also I added DB in the end of name of the function to know that this function is taking care of
stuff about database(in this case duplicated field which must be unique).

For getting the field that was duplicated and it's value we must use a regular express to extract the value of that
duplicated field which the user sent to us, from the message property of the error. The non operational error message property that is
coming from mongoose is something like:
"message": "E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: \"<THE VALUE OF DUPLICATED FIELD\" }",
For finding the duplicated field and it's value, the instructor uses:
const value = err.message.match(/(["'])(\\?.)*?\1/);
Now we want the first element of the result of the match() method. So :
const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
But in my error object there isn't any message or errmsg property. Instead I have keyValue property which has an object of
duplicated field-value in request.*/
