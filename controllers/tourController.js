"use strict";

const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/* Now the __dirname value is pointing to routes folder, instead of app.js which is in root. So we must change the path for readFileSync()
method.
const appFileName = __dirname.replace(/\\/g, '/');
const tours = JSON.parse(fs.readFileSync(`${appFileName}/../dev-data/data/tour-simple.json`)); */
/*
const fs = require('fs');
exports.checkID = (req, res, next, val) => {
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
};
*/
/* exports.checkBody = (req, res, next) => {
     400 status code stands for bad request. So basically an invalid request from the client, which is in this case trying to
     create a new tour without a name and without a price property.
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
/* Let's allow user to filter the received data using query string. So filtering makes sense on getAllTours() in our API.
So here we want to allow user to filter data, so he will get only the data that matches the filter. 
A query string starts with a question mark and then user can specify some field-value pairs.
Now we must access the query string in express and in express the data in query string are on req object and then
the query property.*/
exports.getAllTours = catchAsync(async (req, res, next) => {
  /*
  Important: When you have an async function, if you're awaiting all of the promises that are inside of the total async function AND
   IF Total function doesn't return a promise itself, you don't need to use await on the calling code and wrap it again in a function
   with async keyword. That's why when we're calling this function in tourRoutes we didn't use await or ....
  When we don't pass anything into find() method, it will return all the documents in that collection.
  So it's like kind of: First we build the query and then we execute the query with await keyword. Why we can build
  the mongodb query from query string? Because the query string is almost identical to native mongo queries. So with
  some changes we can filter the data using the query string.

  Let's say the query string is : ?difficulty=easy&duration=5

  For writing db queries in this method we can eiter say:
  const tours = await Tour.find({
      duration: req.query.duration,
      difficulty: req.query.difficulty
  });

  Or either:
  const tours = await Tour.find()
                          .where('difficulty').equals(req.query.difficulty)
                          .where('duration').equals(req.query.duration);

  Other mongoose methods are: lte(), gt() and ...
  Remember: find() will return an object which is a Query (So in this case <model>.query will also return a Query),
  so that's why we can chain other mongoose methods to this code. So on Query.prototype we have a lot of methods like gte,
  sort, where and ... .
  Query.prototype refers to objects that we're creating using Query class.
  Important: As soon as we await the result of query, the query will then execute and come back with the docs that match our
  query. So if we do it like this (using await), then there's no way of implementing sorting or pagination or all of those
  other features. So we must save the part of query into a variable and in the end after we apply all of the methods we want
  to the query, we can await the query and receive the docs.
  So if we await the result of query immediately it would be impossible to sort or limit or use any other method on query.

  Now we implemented with .find(req.query), but this approach is too simple. Because if we have a key-value pair in query string
  that has nothing to do within the db, then we shouldn't look for that key-value pair in db. BUt with this approach, we WOULD
  query for that key-value in db even it hasn't anything to do with db, like pagination. So if the user request the api with
  query string of ?page=2 , with this implementation (.find(req.query)), we would query the database for page=2, but as we
  know there ins't any doc in collection that has page=2, so the response would be nothing!
  So when there's page key-value pair in query string or a few other key-value pairs, we don't want to query db with these
  key-value pairs! But with this implementation we would. So it isn't a good implementation. So we must exclude these special
  field names from our query string, before we actually do the filtering (query the db under a condition).
  For doing this task, we must create a shallow COPY of req.query object. So let's create a new variable that gets a COPY of
  req.query and not the req.query itself. The variable is queryObject. For this variable we really need a hard copy of
  req.query and we can't just do: const queryObject = req.query; (assigning req.query to queryObject).Because in further code
  we would exclude (delete) some properties from queryObject and with this, those properties from req.query would ALSO BE
  DELETED (but we don't want this!Because req.query must show all of the key-value pairs from query string not some of them!)
  and that's because:
  Important: In JS, when we set a variable to another object or in other words, assign an object to a variable, that variable
  would be a reference to the original object. So if you delete something from the variable that we assign the object to it,
  those properties from the object would be deleted too. So we need to pass a hard copy of req.query to the variable. So
  we can use structring and then create a new object out of that.
  The structuring or ... will basically take all of the fields out of the object (copying the key-value pairs) and with
  curly braces we're creating a new object. So with this code, we have a new object(not a reference to original object)
  that is going to contain all the key-value pairs that were in req.query object.
  After this let's create an array that is like a list of the parameters that we want to exclude from query string.

  We use .forEach() because we don't want to save a new object.

  In mongo, when we want to use an operator we must start another object: {duration: {$gt: 5}} So in this example for using
  greater than operator we must start a new object. But in query string we must place the operator inside a pair of brackets
  before the equal sign. For example: ?duration[gte]=5&difficulty=easy
  Now if use console.log(req.query), the result would be: { duration: { gte: '5' }, difficulty: 'easy'} which is almost
  identical to the filter object that we write in native mongo, the only difference is the $ in mongo filter object for operators
  that query string doesn't have it. So now we get the query string and then delete the key-value pairs other than the
  excludedFileds array.
  Learn: Now we know from beginning that query string is almost identical to native mongodb filter object. So we must prepare
  that if user send [<operators>] in query string we must add $ to them in the queryObject.

  Now how we add $ to operators in queryObject variable? First we should convert the queryObject object to string. AFTER THIS
  WE CAN use .replace() method on it. Remember that .replace() only works on strings not objects or ... .
  In regular expression, we need to find one the operators and replace it with the $ one and we add \b before and after the
  inner parentheses because we want to find these exact words. So imagine there's a word inside the string that has lt in it.
  But we don't want to replace that word but we want to replace a word that is EXCATLY lt, without any other string stick to
  it. So because of this we used \b. The g flag means that it will happen multiple times, so if we even have 2 or more of
  those words, it would do the same for ALL of them. But without the g flag, it will replace only the first occurance of
  those words and won't check further.
  replace() method also accepts a callback and in this callback the first arg is the matched word and What you
  return in that callback will be replaced to the matched content.
  Important: The replace() in JS returns a new array.So you must store it in a variable (usually in the original variable, so
   the variable must be declared with let and not const.Because we're reassign it to a new array.).

  Important: The mongodb and mongoose methods need queries to be objects.
  The $gte and ... are filter functionality that our API has them.

  Now we must create the sorting feature that a user can sort the results based on some fileds which those fields can be passed
  into query strings.

  */
  /* Instead of keeping all of the features of our API in this function, we create a class for our APIFeatures and put each one
  of our API features in one method of that class. */
  /* 1)Filtering the results:
  For filtering, we want to change (in this case, delete) some fields of req.query, so we must hard copy the req.query, so
  with this approach, the further code that is using req.query won't work with changed req.query, but with original req.query
  object.
  IMPORTANT: When you're using a string method in JS that is returning a NEW array or NEW strting or ..., you must store the
  result of using that method in a variable, because if you just console.log() the string or array that use a method on it,
  that method doesn't change the original array or string. So you must store the result of using a method on an array or string
  to get the changes and if you want to store the result of using a method on an array or ... on that variable itself, you must
  declare that variable with let not const from beginning. Because by using a method on that variable, you're changing that whole
  variable.Like what we did with queryStr below. Or what we did with fields variable in further code...(we declared it with let and
  other stuff that I mentioned.)
  const queryObject = {...req.query};
  const excludedFields = ['page', 'sort', 'limit', 'fields'];

  excludedFields.forEach(el => delete queryObject[el]);
  let queryStr = JSON.stringify(queryObject);

  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      return `$${match}`;
  });

  let query = Tour.find(JSON.parse(queryStr));
  */
  /* 2) Sorting the results:
  We must declare query variable with let, because in further code we want to chain something to this query.(query.sort())
  Remember: <model>.find() will return a query, so because it returns a query we must store it in a variable and then in
  further we can again chain some other mongoose methods on that variable which keeps the query as value.

  sort() method for numbers is making results ascending by default. But if you want to sort them in desc order you can set
  the value of query string to -<value>. For example: ...?sort=-price . This would be sort the price field desc.
  We can have some docs that have some equal or same fields based on sorting, now how they would sort? For example how results
  with same price would ordered within themselves? So for example: 997, 320, 320, ... . How those 2 docs with 320 price field
  would ordered in results? So we want to sort them based on the second criteria. So in case that there's a tie, then we want
  to have a second field which we can sort the docs that are tie in first field(in this case the first field is price).
  In mongoose this is easy, so we list the fields that the sorting would be based on them: sort('price ratingsAverage') , in this
  example, if the price was tie, those docs that have an equal price would be sort based on their ratingsAverage . But for
  spcifying the sort fileds in query strings, we must separate them by comma. So in the prior example, the query string would
  be: ...?sort=price,ratingsAverage . So as you saw, in mongoose and in sort() method, we separate fields for sorting with
  spaces, but in query strings we separate them by comma. So we must manipulate req.query.sort and replace commas with
  whitespaces.
   if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
  } else {
  query = query.sort('-createdAt');
   }
   Let's sort docs in desc order based their createdAt field in desc order, so the newest ones always appear first.
  */
  /* 3) Field limiting:
  In query string, user lists the fields that he wants. For example: ...?fields=name,duration (Remember: In query string, we
  can't have white space.)
  The operation of selecting only certain fields of results is called projecting which uses .select() method in mongoose.

  Mongoose creates __v field in each doc and sets it to 0. Because it use those fields internally and we can disable them but
  that's not a good practice. Because mongoose actually use them. But what we can do is never send them to the client. So
  we can exclude them and we can exclude a field from sending it from server to client by using -<field name> in select()
  method. Basically select() method, sends some fields from server to client.
  Notice that by using -<field names>, we EXCLUDE that field and send EVERYTHING EXCEPT that field(s) to the client. But when
  you're using <field names> in select() method, ONLY THE SPECIFIED fields will send to the client. This point also applies
  in query string. So if user writes: fields=-name in query string, everything except name field would send to the client
  and if writes fields=name , only the name field would send and ...
  Right now if user requests some fields in fields parameter in query string except situations like ?fields=name, ... (everything
  except __v) the __v field would send to client.But if user doesn't specify any field, __v wouldn't send by server. You can don't
  send the __v at all, like what we did below. BUUUUUUUUUT! Disabaling __v or version key is NOT recommended and also you can't do it
  with something like: fields = fields.concat(' -__v'); because mongoose would throw an error and say:"Projection cannot have a mix of
  inclusion and exclusion." and this is very clear. Because the user specifies some inclusions in query string and after that in code,
  we are excluding something and both of them in a request are not allowed. So because of that it would give an error.
  If you want to disable version key or __v, you must do it in the schema, by saying: (which is not recommended)
  {
      versionKey: false
  }

  Also we can also exclude fields right from the schema. For example when we have sensitive data that should only be used internally.
  For example, stuff like password should NEVER BE EXPOSED TO THE CLIENT.Therefore we can exclude some fields right from the schema.
  Or for example, we might not want the user to see when exactly each tour was created and we want to always hide the createdAt field.
  So always in this case means from the schema and not from the controllers. So we must go to where the schema is created and defined.
  So it is in models and for any field we want to always hide it from client, we can set the select property to false for it. So with
  this, we can permanently hide that field from the client (don't send them).

  if (req.query.fields) {
      let fields = req.query.fields.split(',').join(' ');

      query = query.select(fields);
  } else {
      query = query.select('-__v');
  }
  */
  /* If user didn't specify the fields in query string: */

  /* 4) Pagination:
  We must allow users to only select a certain page of the results. For this we must use page and limit fields in query string. The limit field is
  the amount of results that we want per page and the limit() in mongoose does the exact thing that I mentioned. So it is amount of results that we
  want in the query and the skip() is amount of results that should be skipped before actually querying the data. For example: ...?page=2&limit=100
  The prior query string the user wants page number 2 and each page must have 10 results. So it's clear that the results 1 to 10 are one page 1 and
  11 to 20 on page2 and in other words we want to skip 10 results before we actually start querying. So it would be skip(10).limit(10) in mongoose.
  Another example: If user wants page number 3, first, 20 results would have to be skipped. So we need to calculate the skip value. So it would
  based on the page and limit value that user was sent. But you might ask why we do not directly asked for skip value in query string from user?
  Because for user, the skip value is abstract. In other words, for user, it's much easier to not deal with skip value. So the user just should
  say, "I want page number 6" and not specify the skip value.
  Also remember, we still want pagination even if the user does not specify any page or any limit. Because we don't want to show ALL of the results
  for user's request. So we can define some variables for default pagination.

  Important: The values of parameters in query string are always string.Even if we define number for values. So if you write:
  req.query.<field in query string> , it would gives us the value of that parameter in query string and that value would be a string.
  For example: ?page=2 , The value would be string not number. So 2 in this example is a string not number.So for further calculation it's better to
  convert it to number. So we can multiply it by 1. So each time that is a number in query string it will be a strung, so we need to fix that,
  simply by multiply it by 1.
  Learn: The || 1 is how we define a default value for a variable. So for example if user didn't specify the page number, the value
  for page number would be 1 and ideally the user would only specify the page number that he requests and not even bother with the
  page limit, so the page limit would be 100 in that case.

  The skip variable represents all the results that come before the page that user requested. So for example if user requests page number 3,
  the results would start from 21 (so we must skip 20 results before that) till 30.
  Also if user requested a page that is not exists(for example we have only 5 docs and user requested: ?page=4 , so in this request, the limit
  would get a default value which is 100. So the skip for the previos request would be 3 * 100, so we're skipping 300 docs of db, but we have
  only 5 docs, so the results would be none. So we want to throw an error for client and this situation happen when there's the page parameter
  in query string. So we must do it in an if statement).

  Remember: In each feature we're chaining some methods on our query to make it more specific and at the end we await for executing that query
  and the chaining of methods on query is possible because each mongoose method for queries are returning a new query itself.So we can chain the
  next method and next method ... until we finally await the query.

  Remember: In the pagination feature, we shouldn't first check if the page and limit parameters in query string are exist.Because if even
  there isn't any page or limit in query string, we set them a default value. But if we check the existance of them first and they don't exist,
  we never reach the codes that set the default value.

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  */

  /* We must check the query string that has a page parameter or not? Because if it hasn't, we wouldn't have any skip and therefore, we won't
  have any error that says: This page doesn't exist.

  if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
          /* Why we're throwing a new error here? Because if we throw a new Error in a try block, it will automatically and IMMEDIATELY move
          to the catch block and in there it would send back the 404 response.
          throw new Error('This page does not exist.');
      }
  }

  query = query.skip(skip).limit(limit);

  /* We can provide an alias route to a request that might be popular. For example, we might want to provide a route, specifically for the
  five best cheap tours.If we use our regular route with the filters and sort and with all the features, the request would look like this:
  ?sort=-ratingsAverage,price and this query string says: Sort docs based on their highest ratingsAverage field and if two or more docs have equal
  ratingsAverage, then sort them based on their price field ascending (cheapest to most expensive).

  Important: In prior query string, if we reversed the order of those parameters, the results would be different. So it would be:
  ?sort=price,-ratingsAverage and this query string says: Sort the results based on lowest price and if between two or more docs, have
  the same price, the one that has the highest ratingsAvg should come first and ... .

  Important: Mongodb will search ENTIRE database and THEN sort the docs. Because .find() method, had come first and then limit just 5 results
  that are in top.*/
  /* Execute query:
  Tour.find() is a query object.
  Important: When we are chaining methods on something we must look at the result of previous chain or previous method. So when we have
  features.filter().sort() we must look at the result of features.filter() , because .sort() is chained on result of features.filter() .
  So we must keep attention on returning value of features.filter() in order to chain something else to features.filter() .
  But we know that features is an object that has access to filter and sort and other methods. So we can chain one method to on it and
  that's gonna work.But result of features.filter() right now, doesn't return the features object, so we can again chain another method
  on it (in this case we can't chain .sort() on it.). So we must return the object in filter() in order to be able chain another method
  on it and also do this for sort(). So in methods of this class in the end we say: return this; with this code, we return the APIFeatures
  object, so we can chain methods of this class on the result of previous chaining.
  So remember that all of this chaining here, only works because after calling each of these methods, we always say: return this
  and this keyword in this case, is the object itself which has access to each of these methods and therefore making it possible to chain them.

  Remember: When you want to add some methods to a object (remember it must be an object. Because non-object can't have a method) you must SAVE
  those methods to that variable so we would have an assignment operation,
  so you can say:
  let <variable> = <some code>;
  <variable> = <variable>.method();

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
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours
    }
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  /* findById() is a shorthand or a helper function for findOne() method. So we could also say:
  Tour.findOne({ _id: req.params.id }) So findById() is a shorthand for writing the filter object in findOne() and behind the scenes
  the findByID() will work exactly like findOne(). */
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
    return next(new AppError("No tour found with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });

});
exports.createTour = catchAsync(async (req, res, next) => {
  /* This code will work but there's an easier way.
    const newTour = new Tour({
      name: req.body.name,
      price: req.body.price,
      rating: req.body.rating
  });
  newTour.save().then();

   The difference is in this approach, we call save() method on new document, but in the next approach we call the create() method
   on model itself (directly) instead of calling the method on the instance of model which is our new document.
   In Tour.create(), because .create() returns a promise, in order to access the document that was created inside db, we must
   use .then() . But it's better to use async await. So we are waiting for the returned promise of .create() and save the resolved value
   of this promise to newTour variable.
   Remember: With using async await, we need to test for errors by using try catch syntax.
   In catch block we have access to error object, by specifying a name for argument that stores the error object.
   Also in catch block, we need to think what the errors would be? One error would be the request didn't provide all of the
   required fields that we specify in schema and that's a validation error. Because if we try to create a doc without one of the
   required fields, then the promise that is returned from .create(), would be rejected and if we have a rejected promise,
   it will enter the catch block.
   Learn: Rejected promises will enter the catch block.
   Learn: 400 status code means bad request.

   Remember: If eslint gives an error that says: The async functions are not supported... . This is because of node plugin. So go
    to package.json and in there define the node version that you're using. So after devDependencies, say:
    "engines": {
      "node": ">12.0.0"
    }

    But with even specifying ">7.6.0" it's enough to make this error disappear. But it's better to specify the real version of node
    that you're currently using.

    Learn: When the client send additional fields that aren't in the schema, those additional fields and values will ignored by
     the schema and won't inserted into db.

    In this function, we're creating docs, USING MONGOOSE.  */

  /*
  try {

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
  }
*/
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour
    }
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  /* When we update an object or a resource, we send back 200 for status code.
  In third arg of findByIdAndUpdate(), we pass in an object of options and in there we can set new property to
  true and by setting that property to true, the new updated document is the one that will be returned from that method
  rather than the original doc and since we want to send back that updated document, we always want this method
  So also to return that updated doc. we must store that retuned doc into a variable.
  With setting true for runValidators option, each time that we update a certain doc, then the validators that we
  specify in the schema will run again.
  Learn: When we say: <class>.prototype. ... , it means an object that was created from a class. For example:
   Tour.prototype.save() means an object created from Model class. So save() method in there refers to a document
   and not on the Tour Model class, which is an object from Model class.
  Important: So in mongoose when you see Model.prototype.save() we find out that the save() method is going to be
   available on all of the instances created through the Model class and save() it's not available on Model itself.
   So if you try to write Tour.save() it would give an error, but if you use .save() on a document (an object) created through
   the Tour, it would work.

  Methods like findById() or update() or ... will return query objects.

  Instead of tour: tour we in an object we can say: tour.
  Remember: In updating a doc, if you send additional fields that curr aren't exist in database, they would be ignored.

  Because of runValidators: true , if we send String Instead of Numbers when updating docs, it would give us an error. Because
  it would look at the schema for data types.
  Also because for updating we're using PATCH HTTP method, the original doc wouldn't replaced by the new object that we sent in.
  But if we were using PUT request, the original object (doc) would completely replaced with the new one that is sent in and in
  that case it won't work with findByIdAndUpdate() method. Because this method updates the fields that are different in body
  and in db.*/
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
    runValidators: true
  });

  if (!tour) {
    return next(new AppError("No tour found with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
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
    return next(new AppError("No tour found with that ID.", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });

});
exports.aliasTopTours = (req, res, next) => {

  /* We need top 5 cheap tours.
  Remember: What we're doing in this middleware is basically prefilling some parts of query object that is related
  to top 5 cheap tours.So as soon as we arrive to getAllTours function, the query object is already prefilled even if
  the user didn't put any of these parameters in the query string.
  We need to pass everything to req.query, in string format, even numbers. Because the nature of query string
  is everything is string. Also make sure that in sort() method, you don't place any whitespaces. Because in query strings
  there isn't any whitespace. So also you shouldn't place any whitespaces when you're chainging the value of query string,
  yourself.
  Also let's specify some fields instead of all of them.*/
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};
exports.getTourStats = catchAsync(async (req, res, next) => {
  /* The full name of this route handler function is getTourStatistics(). First we use our Tour model in order to access to
  tours collection and then use aggregate() method on the model.
  Using an aggregation pipeline is a bit like doing a regular query. But the difference is that in aggregations, we can
  manipulate the data in different STEPS. So we must define these steps and for this task, we pass in an array that is
  called stages. So the docs will pass through these stages one by one, step by step in the defined sequence of stages.
  So each elements in that array would be a stage. Each one of the stages is an object and for the value of $<stage>, we would
  write a mongodb filter object.
  $match stage is for select or filter certain docs.In other words, it's just like the filter object in mongo.
  Usually the $match stage is just a preliminary stage, to then PREPARE for the next stages which come ahead.
  $group stage allows us to group docs together using accumalators and an accumelator is for example, calculating the average.
  So if we have 5 tours and each of them has a rating. We can calculate the average rating using $group.

  For now, we specify null for _id in $group, because we want to have everything in ONE group.So then we can calculate the
  statistics for all tours together and not separate them by groups. But later, we will group docs based on different stuff.
  For example we can group by difficulty and then we can calculate the average for easy tours, the average for medium tours and ...
  Recap: We can group docs by one of our fields and we're gonna specify that field in value of _id inside $group object.But for
  now we want calculate the average for ALL the tours together which are inside a big group. So for having one big group for all
  of our docs that are inside a collection (we are specifying that collection, when we are creating the model).

  For the value of $avg, we specify the name of the field inside quotes not inside an object.
  Remember: We specified the avgRating and avgPrice arbitrary. In avgRating we are calculating average of all of the doc's average ratings.
  In other words, $ratingsAverage is for each doc but avgRating is just one value for all of the docs.
  *
  * Remember: <model>.aggregate() is gonna return an aggregate object (but for example, .find() would return a query),
  *  but we need to await it.
  *
  * As you can see, in the code for creating aggregation pipelines, we specify the fields in collections in this format:
  * '$<name of field>'
  *
  * Important: For getting the number of docs in collection, we can add 1 to $sum for each of docs.So it would be:
  *  <name of field(arbitary-for example: numDocs)>: { $sum: 1 } , so in this example, $sum: 1 means add 1 for each of the docs.
  *  Sp at the end it would be total number of docs.
  *  So for each of the docs that is gonna go through this pipeline, 1 will be added to the name of the property. In our code, the
  *  name of property is numTours.
  *
  * So totalStats is the statistics for all the tours docs TOGETHER. But let's group our results based on different fields.
  * Important: When we set the value of _id to a value other than null, we basically say: Group docs by that specified field in
  *  value of _id, so each doc that has the same value of _id would go inside one group. So when _id: '$difficulty', each doc
  *  that has a difficulty of easy, would go inside same group and for each group, mongoose will calculate the specified properties
  *  that are in further. For example it would calculate the numTours and avgRating properties for each group of difficulties.
  *
  * $match is like a precondition that docs which match that condition would enter the next stages.
  *
  * We can also add another stage that sits besides of stages like $match and $group and it's called $sort . So it would
  * be an object like prior stages which sits in the array that we pass in to aggregate() method. In $sort stage, we need to
  * use the the fields that we specified in the $group stage But you must use the new field names if they exists. Because
  * when we're using $group , we may use some new field names for property keys. In this case our actual field name is
  * averagePrice in db, but we used avgPrice in $group.So we must use the new field name which is avgPrice in $sort stage.
  * In $sort stage, 1 means ascending.
  * Remember: We use $sort stage for more than one groups. So in our code it's none sense to use $sort for totalStats. Because
  * it would have just one group of data.
  * We can also repeat stages.
  * $ne is a new operator and it's meaning is not equal. In statsBasedOnDifficulty basically we're exculding the group that
  * has the _id set to EASY.
  *
  * */
  let stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    }
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
    status: "success",
    data: {
      stats
      // statsBasedOnDifficulty,
      // statsBasedOnDuration
    }
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  /*Problem: Implement a function that calculates the busiest month of a given year.
  * So basically by calculating how many tours start in each month of the given year.
  * First create the function and after this create a route for this function. Let's call it '/monthly-plan'
  * Remember: For the things that you want to pass in to .aggregate() method, first you pass in an array and then in that array
  * we pass in one object for each of the stages we want.
  * Actually we want to count how many tours exist for each of the months in the given year.
  * Learn: $unwind stage deconstruct an array field from the docs and then outputs one document for each element of the array and in
  *  our problem we want to have one tour for each of the elements in startDates array field. So for the value of $unwind we specify the
  *  field which is an array and we want to deconstruct that array and make each of the elements in that array, a separate document.
  *
  * When we use $unwind on a field specified as the value of $unwind, in results, we longer would have that field as an array and
  * now we have each element in startDates array as a separate field. After $unwind stage, we must select the documents for the year that
  * user was passed in. So the results we want to send to user must have a same year that user passed in.So we can use $match to send the
  * results that have a same year which user requested. So we want the tours in the year that user requested. So the startDates of these
  * tours must be in the year that user requested in other words, the startDates can be from first day of year until last day of year.
  *
  * Remember: The value of $group stage must be an object which we have a field called _id in that object and the docs will group together
  * based on this field. So Learn: $match is just for select some docs based on some conditions.
  *
  * Important: The key of a key-value pair in stage objects can not be the name of a field that has a $ and quotes around it.
  *
  * Important: The _id field would be usually in $group stage and maybe other stages. In $group with this field we can group docs that have the same field
  *  which is specified in the value of _id.
  *
  * In this problem we want to group docs based on their month. BUT currently we have the ENTIRE date, not only the month. So we have the year, the month,
  * the day and even the hour and ... .But we want to have only the month to group them. For this task we can use another new mongo operator.
  * It's called $month which returns the month as a number.So it would basically EXTRACT the month out of our date. For value of
  * this $month operator, we pass it the name of the field that we want to extract the month from it.
  * Now after soecifying the _id for grouping, we can specify the real information that we want for each of those groups is how many
  * tours START in that month? We can count the amount of tours that have a certain month.
  *
  * Learn: In $group stage, after specifying the field that you want to group docs based on that field, you should specify the
  *  data that you want to see in EACH GROUP. That data could be the number of docs in each group, or average of a field in each group,
  *  or highest (maximum) of a field in each group and ... . In this case we're counting number of docs in each group and the arbitrary key name
  *  for that field is numTourStarts .
  * After calculating number of docs in each group, we need some more information about which tours are in this group and not just the
  * number of docs in each group. So we can specify an arbitrary name for the key that we want to show the information of tours (which I named it tours)and
  * then because possibly we have more than 1 tour in each group, we must show their information in an array, right? Because if you
  * don't want to use an array, for this, how could you show the information of 2 or 3 or ... tours in one field? So for creating an array,
  * so we use $push to push the name field of each document that goes through this pipeline for EACH GROUP.
  *
  * Now we want to change the name of _id field. Which we haven't access to that directly, it's a bit tricky. The solution is we can add another
  * field which has the exact value of _id (the value of _id field is '$_id') in each group but with a different name and after creating that
  * new field which is gonna be exist for each group, we can delete _id field from each group and now we have a new field which has the
  * same value for each group.
  * In $addFields stage, we must specify the NAME of the field that we want in the key of $addFields object and the value of that key is the actual value
  * of that newly created field.
  *
  * Now we need to delete the _id key-value pair from the groups. So we can use $project stage. For the value of $project, we give it an object
  * and in this object we can exclude or include some fields.
  *
  * In the value for $sort stage, the key name is the field name that we want to sort docs based on it and the value of that key is 1 or -1
  * 1 is for ascending.
  * In this case and in $limit stage, we specify we want to have 12 results (in this case, it would say that we want just 12 groups.)
  *   */
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
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
      }
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    {
      $addFields: {
        month: "$_id"
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStarts: -1
      }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan
    }
  });
});

/* Because we don't have only one thing to export, so we are not going to use module.exports, but instead we will put all of the
things we want to export inside exports object. So for example instead of saying :
const getAllTours = () => {...};
we must say:
exports.getAllTours = () => {...}; */
