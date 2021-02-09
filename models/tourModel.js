'use strict';

const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require('validator');

/* We could just say the name field must be a String So we could say name: String and price: Number, but we can also define
* schema type options by giving an object to the field which is more advanced. So that object has got schema type options.
* In required option we can specify the error that we want to be displayed, when we're missing that field.So in order to do this,
* we pass in an array to required option, which in that array the second element is the error string.
*
* Learn: required option is called a validator and we can also create our own validators.
*  Also when we expect certain values for a field in database, that would be a validator.
*
* Schema options are not mandatory.Buf if you want more features, then we need to specify the schema type options object.
* default option is when you create a new tour doc using this schema and not specify the rating, it would automatically set to
* 4.5 . The unique option is now we can't have 2 tour docs with the same name.
*
* For creating a model, you should use uppercase for the first letter of model. In .model() , the first arg is the name of model.
* In .then() of testTour.save() we have access to the document that just saved in the database. So basically we have access to the
* resolved value of the promise that .save() returns.
*
* Important: Mongoose by default produces a collection name by passing the model name (first arg of .model()) to the
*  utils.toCollectionName() method.
*
* Mongoose add __v field automatically to each doc that was inserted.
* If the collection doesn't exist when we create the first doc for that collection, mongoose will automatically create it for us.
*
* With this code, we inserted a doc into database VIA OUR CODE.
* The explanation of code is: When you created the model, you must create an instance of model and that instance would be the new
* document and then pass in Tour() the fields and values for that document and then you must save that document.Like below:
*
 const testTour = new Tour({
    name: 'The Park Camper',
    price: 497,
    rating: 4.4
});
*
* At last, we must export our model from this variable to use it (querying, deleting and ... docs) in the related controller file.
*
* About ratings, later we would have another resource called reviews, where users will be able to write reviews about tours and 
* ratings. So it's completely different resource, so it would have a different model. BUT still we want to have a summary of 
* these ratings and of these reviews which are in a different model, in this tour model. SO THIS APPROACH IS ACCEPTABLE.
*
* We didn't gave those 2 ratings fields a required validator.Because it's not the user who creates these tours who will actually
* specify the ratings values and those ratings later will be calculated from the real reviews.
*
* trim schema option only works for Strings which will remove all the whitespaces in the beginning and in the end of the string.
*
* The summary schema option is required because it's on the overview page and we defenitly want to show it.
* imageCover is just the name of the tour image and we will read the image from the file system. But in db we just store the name
* of the image as a reference.
*
* Learn: We could store the entire image in database as well, but it's not good. We leave the images somewhere in the file system
* and then put the name of the image itself in the db as a field.
* 
* In images schema option, we would have multiple images, so we must save those images as an array of strings. So we must specify
* an array of strings ([String]) for that field value, instead of an object of schema options.
* So in schema, [String] means a number of strings in an array.
* 
* Date is a JS built-in data type. Date.now() will give us a timestamp in milliseconds, which represents the current milliseconds.
* But in mongo, this millisecond will immediately converted to today's date, in order to makes sense.
* createdAt will automatically created.
*
* startDates are different dates for the same tour. But this schema option won't automatically created by mongo, but mongo will 
* automatically try to parse the string that we passed in as a date into a real JS date. So in that array we could pass in an 
* element like: "2021-03-21" or "2021-03-21,11:32" and then mongo will automatically parse this string to a valid date. Or we can
* input a unix timestamp like the format we have in Date.now() , So mongo will try to parse all of these date formats into a JS
* date and only if it can't, it will throw an error.
*
* Remember: When the schema is changed and some default fields have been added to the new schema, mongo will automatically update
* all of the old docs, so now they have also those newly added with default option fields!
*
* Virtual properties are basically fields that we can define in our schema but that won't be persisted. So they won't save into
* database in order to save us some space but most of the time, we want to really save our data to db, but virtual properties make
* a lot of sense for fields that can be derived from one another. For example a conversion from miles to kilometers. (We know that
* miles and kilometers are derived from one another). So it doesn't makes sense to store these fields BOTH in the db, IF we can
* easily CONVERT one to the another. Now let's define a virtual property that contains the tour duration IN WEEKS.So that's a field
* that we can very easily CONVERT it from duration field that is currently in our model and it's IN DAYS (so we want to CONVERT it
* to weeks-therefore we can use a virtual property).
* Learn: For defining virtual properties on a schema, we must define them ON THE VARIABLE that contains the schema. In this case,
*  that variable is tourSchema.
* We pass in the NAME of that virtual property in .virtual() method.
* Why we use .get() method on .virtual() in our code? Because that virtual property will be created each time that we get some data
* out of database so that get() method called a getter and in that .get() method we pass a real callback function (NOT AN ARROW FUNCTION!)
*
* Why we divide duration by 7? Because we want duration in weeks not days, so we divide it by 7.
* Why we used regular function (a function with function keyword) in the callback for .get() ?
* Learn: Because remember, an arrow function does not get it's own this keyword which in this case we want this keyword in the function.
*  Because in that function, this keyword is going to point to the current document.
*  So usually when we want to use this inside a function (doesn't matter in callback or normal function or ...), we should use
*  the function with function keyword.
*  Tip: In mongoose we usually use functions with function keyword.
*
* So the durationWeeks field won't persisted in db, but it's ONLY gonna be there (in db) as soon as we get the data.
* Now this virtual property won't be in the results and that's because we need to explicitly define in our schema, that we want the
* virtual properties in our output. How we gonna do this? Remember that in parentheses of mongoose.schema() , we can pass in not only the
* object which has the schema definition itself, but also an object for the schema options which is the second arg of mongoose,schema() .
* So the first arg of mongoose.schema() is that large object which is the definition of schema itself (fields and their types and ...) and
* the second arg is an object which has options for schema.
* Now we can do our task in this second arg of mongoose.schema() .
*
* In toJson we're saying: Each time that the data is outputted as json, we want virtuals to be true. virtuals to be true means that
* the virtual properties must be part of the output.
*
* toObject means when data outputted as an object, also we want the virtual properties to be in the results too.
*
* Now by setting these, we should be able to see our virtual properties in results.
*
* Important: We can't use virtual properties in queries to db. Because they're technically not part of the database. So we can't say
*  for example: Tour.find({durationWeeks: 1})
* Of course we could also do this conversion each time after we query the data, for example like in a controller, but that would not be
* the best practice.Because we want to try to keep business logic and application logic as much separate as possible (fat models and thin
* controllers- which says that we should have models with as much business logic as we can offload to them and thin controllers with as
* little business logic as possible) , so virtual properties are a good example of how we can acheive that kind of architucture. Because
* knowing the durationWeeks is a business logic, because it has to do with business itself(like the tour company!) and not with stuff
* like requests(things that do in code and express.js are application logic). So we do the calculations for business logic in models and
* not in controllers.
*
* pre() middleware is gonna run BEFORE an actual event and that event in this case is save event and the callback function for this
* .pre() method will be called before an actual document is saved(our event) to the db. So this is a document middleware which is gonna
* run before the .save() and .create() command BUT NOT ON insertMany(). So if we use .insertMany() , the document middleware won't be
* executed or in other words insertMany() won't trigger the save event document middleware.
* So the document middleware will only be executed on .save() and .create() .
*
* Learn: In a save middleware (a middleware which would trigger on the 'save' event), the this keyword is gonna point to
*  the currently processed doc and this is the reason why it's called document middleware.
*  So because in the callback function for .pre() method, we have access to the document that is being processed and in this case
*  we have access to the document that is being saved with this keyword.
*
* Now in order to trigger that callback function, we need to run a save() command or create() command. So we now need to CREATE
* a new tour using our api in order to trigger that middleware (why create would trigger this callback function? Well as I mentioned
* before, create and save commands would trigger this callback function or this middleware).
* So now if you console.log(this) in that middleware and then create a new tour, it would log to console the document that was
* created RIGHT BEFORE it SAVED into the database and because at this time we haven't save data to database we can act on the data and
* the place that we act on data BEFORE it's saved to db is inside the callback function for .pre() .
*
* Now in this callback function we want to create a slug for each of the docs.
* Learn: A slug is basically just a string that we can put in the url, usually it's based on some strings like name.
* In this case, we're gonna create a slug based on the tour name. So we must use slugify package as a dependency and then require it
* in our model file.
* For create a slug for the currently processed doc, we create a new property on the doc called slug and we assign slugify() to this
* new property and in parentheses of slugify() we pass it the string that we want to create slug out of that string. So in this case
* we want to create slug from the name property of each document. So we must pass this.name to slugify().
* In our case, the second arg of slugify() is an option that is saying that everything should converted to lowercase.
*
* In mongoose, each middleware function, like pre('save', function(){}) has access to next arg.
*
* Remember: When you define some new fields for some docs or just one doc, THOSE NEW FIELDS WON'T PERSISTED TO THE DATABASE.
* Because we didn't define them in our schema.So when you want to define some new fields for a doc or some docs, before that, you
* must define those new fields in the schema and if you don't do this, those new fields won't persisted to db, but other fields for
* newly created docs WILL persisted to db, because we have defined them in schema.
* After setting up that mongoose middleware and slug property, we must define slug property which is in newly created docs in schema.
* Now when you CREATE a new doc, this new mongoose middleware will triggered and it will create a new property on that newly created
* doc called slug and the slug property on this doc is based on name property and the options that we specified in () of slugify()
* with a little difference and that difference is when you have whitespaces in name property, instead, in slug property we would have
* dash.
*
* Important: Why we even use this mongoose middleware with save event and pre() method? We used it with pre() method because we want
*  to define a field that it's value is BASED on another field that was sent by user. So we must FIRST get the value of that another
*  field and THEN based on the value of that another field, we define the new field and THEN we save that doc to database.
*  So now tell me! How you would define the value of that new field if you didn't define this middleware? (Remember that we don't want
*  our client to send that slug property for creating the doc-we should create that property OURSELVES BASED ON THE PROPERTIES THAT
*  THE CLIENT SENT TO US!)
*
* In the callback function of post('save', function() {}) method, we have access to next and the document that JUST SAVED TO DB, with
* specifying the name of that document in parentheses of callback.
*
* Learn: post() middleware callback functions are executed after all of the .pre() middleware callback functions have completed.
*  So in callback function of post() method, we haven't this keyword like we had in callback function of pre() access to this
*  keyword which points to currently processed doc. Instead, in callback of post() we have access to FINISHED DOC by receiving that doc
*  in parentheses of callback of post() by defining an argument.
*  BUT I THINK WE ALSO HAVE ACCESS TO this KEYWORD IN post() callback function! Which is pointing towards the finished doc(in this case
*  it's pointing towards saved document).
*  Also remember that in both callback functions of pre() and post() , we have access to virtual properties. But those virtual props, won't
*  stored in db.
*
* 'save' event also called a hook and we called that middleware a pre save hook or pre save middleware.
*
* Remember: If you have a pre() and a post() middleware, you MUST call next() in pre() middleware and if you don't do this post()
* middleware won't run and the request will stuck at that pre() method and also if you have multiple pre() or post() , you always
* must call next() in each of them. So it's a good practice to call next() in each of mongoose middlewares.
*
* Important: 'save' mongoose middleware only runs for .save() and .create() mongoose methods and it's not gonna run for .insertMany()
*  and also not gonna run for findOne() and update methods or findBuId(). So we must find a workaround.
*
* Query middlewares allow us to run functions before or after a certain query is executed. Let's create a middleware that's gonna run
* before any find() or findById() or ...(find methods) query is executed.
* Why it's called query middlewares? Because for the hook, we use find or update or ... which are like queries. In pre query middlewares
* the this keyword will point at current query and not the current document, because in query middlewares we're not processing any
* document and we're really processing a query!
* So let's suppose that we can have secret tours in our database.Like tours that are offered to vip group of people and the public
* shouldn't know about it. So we don't want our secret tours to appear on result outputs. So the solution is to create a secret
* tour field and then do query ONLY for tours that are not secret. So if the secretTour field is true it means that tour if secret and
* we don't want it to shows up and by default a tour is not a secret tour. So we say: default: false , remember that default means
* the default VALUE of that field.
*
* Learn: this keyword in a query middleware is pointing to current query object. So we can chain all of the mongoose methods that we
*  have for queries.
*
* Why in filter object in find query middleware, we used { $ne: true } instead of false? Because the older tours don't have the
* secretTour field. In other words, we could just say: { secretTour: false } , but the way that we wrote the code is cleaner.
*
* In our older tours they didn't have a secretTour field and we created this filed on the new doc and set the default value of that field(
* secretTour) to be false. So because we didn't specify this field in our older docs, they haven't this field in database. But our newly
* created doc have this field in db. Because we specify it for that new doc. BUT when you get all of the tours, because 1 doc HAVE that field,
* mongoose will also give that field to our older docs TOO! So now they have that new field in results but they don't have this field in DB!
* (It's kind of wierd!). Mongoose did this. So in database, secretTour field doesn't exist for older docs and it just exists for the
* newly created docs. Mongoose is adding that field to the older docs in results, because we have defined that field in our schema and
* that field won't be in database, so mongoose put that field in results and not db anyway!
* Recap: When you hit a route, for example: .../tours using get http request, we create a query using Tour.find() (in getAllTours()
* route handler) and then chain some methods to that query and then we execute that query. BUT BEFORE THE QUERY IS EXECUTED,
* the pre find query middleware would be executed. Why this middleware and not other pre query middlewares? Because this middleware
* is for 'find' hook and the query that would executed is also find() . So we created a find() query and therefore find hook would be
* executed and in callback function of find hook, since we're at a query middleware, the this keyword is pointing towards the current
* query. So in a mongoose query middleware , we can chain other mongoose methods to the current query. Like find() -like what we
* did in our code and then we're saying: Just give me the docs that haven't secretTour field of them is set to true. So we're saying
* just give me the public tours and not the secret tours.
*
* Now there's one thing to fix. Because our query middleware with 'find' hook would only run for find() query and not findOne() .
* So if we send a get request to '...?tours/<the _id of secret tour>' , it would give us the secret tour in result! and we set things
* up in pre find mongoose middleware, so the tours that have secretTour set to true shouldn't appear in results and they would filtered
* out IN ALL OF OUR ROUTES OR ALL OF THE REQUESTS THAT CLIENTS SEND TO SERVER, like get all of the tours or get one tour or ... .
* But when you send a get request to '...?tours/<the _id of secret tour>' to check if we can get the secret tour separately, you notice
* we can! And this is not good as I mentioned and this is because in the route handler function of this route we're creating query, using
* findById() (which behind the scenes is findOne()) and this mongoose method does not trigger the mongoose middleware with 'find' hook,
* so it won't filter out that secret tour and therefore we can get that secret tour. That's bad!
* So we need to specify a same middleware also for findOne() mongoose middleware. There are 2 ways of doing that. The first one is to
* copy the current middleware and just replace 'find' with 'findOne'. But it's not good. Instead we can use a regex.
* In regular expression we want to say is that this middleware should be executed not only for 'find' but for all of the commands
* that start with the name find. Like findOneAndDelete() and ... Now all of these commands will trigger the callback of that middleware.
* Important: A regular exp shouldn't be in quotes or double quotes because it would evaluated as what it is! Not a really regex.
*
* So with that regex, if you send a get request for getting a secret tour, it won't show that to you.
*
* Learn: In post query middleware, we have access to all the docs that were RETURNED FROM THE QUERY and next.
* Remember: The post query middleware is gonna run AFTER the query was executed, so because the work of query has finished, all of the
* docs are arrived and we have access to them.
*
* Aggregation middleware allows us to add hooks before or after an aggregation happens. In our code, currently if the user sends get request
* to one of a routes that it's route handler functions, use aggregate() for queries, the secret tours also would be in results and we
* don't want this. So we must also create some middlewares for aggregate queries and these middlewares are called aggregate middlewares.
* Again why we want to use an aggregate middleware here? Because our secret tours are also be calculated in routes that their handler
* functions are using aggregate queries. So we don't want our secret tours to go to these aggregate queries and like find() and findAnd...()
* we want our secret tours to not go to these queries and stay hidden.
* One solution would be to exclude the secret tours from filter object of $match stage in each route handler function that is using
* aggregation. But with this approach, we would have some repetitive code. So instead of exclude them in route handler functions, let's
* exclude them right at the model level by using aggregation middlewares.
* In aggregation middlewares, pre() means before the aggregation executed, run this middleware.
*
* Validation is basically checking if the entered values are in the right format for each field in our schema and also that values
* have actually been entered for all of the required fields.
* Remember: We do data validation in our model files and that's because of fat model and thin controller philosophy, which makes
* model file a perfect place for data validation.
* For example required option in schema is a built-in validator for mongoose but unique option, technically is not a validator.
* But it will still throw an error when we have a duplicate value for that field, but again that is not really a validator.
*
* Another validator which is specifically for Strings, is maxlength and minlength. These validators are working for the patch request
* for '.../:id' route, because in it's handler function we set runValidators: true . But we don't need to set this option for other mongoose
* queries like find() or delete() or ... (Just the ones that have update in them)
* Learn: Update validators are off by default - you need to specify the runValidators option.
*
* Golden security notice: Never ever accept data coming from a user as it is. So we always need to sanitize that incoming data.
*
* On Strings we have maxlength and minlength and on numbers and dates we have max and min.
* Learn: enum validator is only for Strings.
*
* Learn: [true, 'A tour must have a difficulty.'] notation is a shorthand for an object of stuff and that object would be :
* {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or difficult.'
  }
*
* On Strings we have other validator like match validator which checks if the input matches the given regex.
* A validator is just a simple function which should return either true or false and if it returns false, it means there's an error.
*
* For creating your own validator, first make sure you are in the object for the value of that field. So if that field was sth like
* this: field:<type> , change it to
*  field: {
*   type: <type>,
*   validate:
*   {
*     validator: <the normal callback function(not arrow function)>,
*     message: <the error message>
*   }
*  }
* Why a normal function? Because in that validator we're gonna using the this keyword which would point to the current DOCUMENT. But
* if you don't use this this keyword, you could use an arrow function instead. So for example in priceDiscount field, we have
* access to the priceDiscount that user sent to us and we can receive this current value by specifying a parameter when declaring
* the callback function.In this case we named it val.
* Important: In our custom validators we always need to return either true or false based on some conditions.
* In our case, we said price (actually this.price, because we want to compare the CURRENT doc, right?) should be always greater than
* priceDiscount, which is currently in val parameter. Why we didn't write it other way? So like this.price < val ?
* In the prior example, it would return false. But it doesn't matter how you write it! We just wanted to write the code that shows
* the correct condition.(The correct condition was price property of current doc must be greater than it's priceDiscount.)
* But it doesn't matter anyway. The validator will run if the user sent priceDiscount in his request.
* In this callback function we have access to the value that was inputted.
*
* Also the message property in the value of validate property which it's value is an object, has access to the current value and
* this works in a weird way because internally it's mongoose not JS. So we can use simply curly braces and then VALUE. So
* VALUE is exact as val in parameter of function. But remember because we aren't inside the callback function, in the value of
* message property, we can't use `${}`. Right? But still we have access to current value.
*
* For specifying our own validator, you must use validate key name. Like the above example.
*
* Important: Inside the callback function of validator property, the this keyword is only gonna point to the current value of that field
*  in document, when we're CREATING A NEW DOCUMENT. So that callback function won't work on update or like that queries. But we can fix
*  this but it's complicated. But of course we can write validator functions that aren't rely on this keyword in their code.
*
* Also there's a library called validator in npm that we can use it for custom STRING validators that we don't need to write them ourselves.
* In isAlpha() method in validator package, numbers and underline and dash and even whitespaces are also invalid. So we commented out in
* name field in our schema!
*
* Important: You shouldn't CALL the methods on validator object. So don't use parentheses when using validator in schema options.
*  And also we din't call our custom callback validator functions.
*
* Learn: There's 2 ways of specifying the validator function (our own or built-in or 3rd party doesn't matter in this case) and the error msg.
*  One way is to use them in an array(the shorthand)- So like this: [<the validator function>, '<error msg>'] OR the second way is:
*  validate: {
*   validator: <the callback function>,
*   message: <message>
*  }*/
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


