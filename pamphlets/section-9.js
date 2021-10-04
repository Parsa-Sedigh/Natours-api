/* SECTION 8. Using MongoDB with Mongoose
83-1. Section Intro:
We're gonna connect a mongodb db with our app and to do so, we're gonna use mognoose which makes working with mongodb in node, easy.
We're gonna atalk:
Data models, implement crucial api features, add some data validation and also use the advanced mongodb aggregation pipeline.

84-2. Connecting Our Database with the Express App:
First we need to get our connection string from atlas. So just like we did before, when we connected the db to compass and to the
mongo shell, we need to get our connection string, in order to connect the app to this hosted db. So click on connect button then click
on "connect your application" and then copy connection string and then add an env variable named DATABASE.
Now we need to put in our password, now we could copy the password from the value of DATABASE_PASSWORD env variable and paste it inside that
DATABASE env variable,

The anatomy of connection string is:
<host> is the place where the db is hosted.
mongodb+srv://<your user>:<password>@<host - ex: cluster0-pw... .mongodb.net>/<name of db that we want to connect to>.

In case you're using the local db, this connection string is easier. You can create an env variable for that as well, like:
DATABASE_LOCAL=mongodb://localhost:<port - 27017>/<name of db>

As you can see `mongodb` in that connection strings are kinda a protocol, so instead of http, it uses mongodb.
Now in order for this to work, you need to keep your mongodb server(mongod process) running at all times, WHEN you're working with LOCAL db.

Now we need to install the mongodb driver. It's a software that allows our node.js code to access and interact with a mongodb
database and there are a couple of different mongodb drivers, but we use mongoose which adds a couple of features to the more native mongodb driver.
In other words, we use mongoose to connect our code to mongodb.
So write: npm i mongoose (tutor uses v5)

Now in server.js which is the file where we do all of the setup of our app, for example the env variables, or the import of our express app file which
is app.js and also we start the server down at that server.js file and this is also the file where we're gonna configure mongodb.
So require the mongoose package there then use connect() . Now access the connection string through process.env.<env variable name for connection string>.

For second arg of .connect() , we pass an object with some options that we need to specify in order to deal with some deprecation warnings.

Since our npm script is not just called `start` which is kind of a standard but start:dev, we always have to type: npm run start:dev ,
so we have to use the word `run` and we can't omit it. So you CAN change the name of that script to start.

For connecting to local db, we pass the process.env.DATABASE_LOCAL(which is the connection string to local db) instead of DB variable that we currently
have.

Now let's delete the collection that we already created in our db in atlas, just so that our mongoose driver doesn't interfere with that in anyway.
Now we have an empty db.

85-3. What Is Mongoose:
- What is mongoose and why use it?
We connected our app with DB using mongoose. But what is mongoose?
Mongoose is an object data modeling (ODM) library for mongodb and nodejs which provides a higher level of abstraction.
Mongoose is a layer of abstraction over mongodb driver.
So it's a bit like the realtionship between express and node.

Object data modeling library is just a way for us to write JS code that will then interact with a database.So we could just use
a regular mongodb driver to access our DB, but instead we use mongoose because it gives us a lot more functionality out of the box.
So mongoose allows us faster and simpler development of our apps.
So mongoose allows for rapid and simple development of mongodb database interactions.

Some features that mongoose gives us: It gives us schemas to model our data and relationships, easy data validation, a simple
query API, middleware and ...

In mongoose a schema is where we model our data. So where we describe the structure of data, default values and validation.
Then we take that schema and create a model out of it and a model is basically a wrapper around the schema, which allows us to
actually interface with the database in order to create, read ... docs.
Schema -> Model
*/
/* 86-4. Creating a Simple Tour Model:
We configure mongodb in the server.js file not app.js . First require mongoose there.

Mongoose is all about models and a model is like a blueprint that we use to create documents, so it's a bit like classes in JS, which
we also kind of use as blueprints in order to create objects out of them.

So we create a model in mongoose, in order to create docs using it and also to query, update and delete these docs.
So basically to perform each of CRUD operations, we need a mongoose model and in order to create a model, we need a
schema.

So we first create a schema.

So we create mongoose model out of schema and we use schema to describe our data, to set default values, to validate the data.

Mongoose uses native JS data types. After specifying data types for each of the fields in the scehma(the most basic way of defining a
schema), but we can take it one step further by defining sth called schema type options for each field, or only for some specific field.

We could just say the name field must be a String So we could say name: String and price: Number, but we can also define
schema type options by giving an object to the field which is more advanced. So instead of passing sth like String or Number to a field,
we pass an object to that field and specify the type of field in `type` property of that object.
So that object has got schema type options.
So the things in that object we pass to field, are `schema type options` and they can be different for different types, for example the `Number`
type has some different schema options than the String type, but many of them are also similar, for example we can use the `required` schema
type option on Number type and other types.

In `required` option we can specify the error that we want to be displayed, when we're missing that field.So in order to do this,
we pass in an array to required option, which in that array the second element is the error string.

Learn: required option is called a validator and we can also create our own validators.
 Also when we expect certain values for a field in database, that would be a validator.

Schema options are not mandatory, so sth like rating: Number is maybe enough, buf if you want more features, then we need to specify
the schema type options object(by passing an object to that field).
`default` option is when you create a new tour doc using this schema and not specify the rating(a field), it would automatically set to
4.5 .

The `unique` option is now we can't have 2 tour docs with the same name.

For creating a model, we wanna create model out of it and you should use uppercase for the first letter of model.
In .model() , the first arg is the name of model(which should start with an uppercase letter).
It's a convention to always use uppercase on model names and their variables, like:
const Tour = mongoose.model('Tour');
So in this example, we both named the model variable and the model name itself(first arg of model()), with an uppercase letter, so with that,
we know we're dealing with a model.

Now we can use the created model in order to create docs.

With new mongoose.schema() , we specify a schema for our data. So basically describing it and also doing some validation and ... .

TODO: tomorrow:
87-5. Creating Documents and Testing the Model:
In .then() of testTour.save() we have access to the document that just saved in the database. So basically we have access to the
resolved value of the promise that .save() returns.

Important: Mongoose by default produces a collection name by passing the model name (first arg of .model()) to the
 utils.toCollectionName() method.

Mongoose add __v field automatically to each doc that was inserted.
If the collection doesn't exist when we create the first doc for that collection, mongoose will automatically create it for us.

With this code, we inserted a doc into database VIA OUR CODE.
The explanation of code is: When you created the model, you must create an instance of model and that instance would be the new
document and then pass in Tour() the fields and values for that document and then you must save that document.Like below:

onst testTour = new Tour({
  name: 'The Park Camper',
  price: 497,
  rating: 4.4
;

At last, we must export our model from this variable to use it (querying, deleting and ... docs) in the related controller file.

About ratings, later we would have another resource called reviews, where users will be able to write reviews about tours and
ratings. So it's completely different resource, so it would have a different model. BUT still we want to have a summary of
these ratings and of these reviews which are in a different model, in this tour model. SO THIS APPROACH IS ACCEPTABLE.

We didn't gave those 2 ratings fields a required validator.Because it's not the user who creates these tours who will actually
specify the ratings values and those ratings later will be calculated from the real reviews.

trim schema option only works for Strings which will remove all the whitespaces in the beginning and in the end of the string.

The summary schema option is required because it's on the overview page and we defenitly want to show it.
imageCover is just the name of the tour image and we will read the image from the file system. But in db we just store the name
of the image as a reference.

Learn: We could store the entire image in database as well, but it's not good. We leave the images somewhere in the file system
and then put the name of the image itself in the db as a field.

In images schema option, we would have multiple images, so we must save those images as an array of strings. So we must specify
an array of strings ([String]) for that field value, instead of an object of schema options.
So in schema, [String] means a number of strings in an array.

Date is a JS built-in data type. Date.now() will give us a timestamp in milliseconds, which represents the current milliseconds.
But in mongo, this millisecond will immediately converted to today's date, in order to makes sense.
createdAt will automatically created.

startDates are different dates for the same tour. But this schema option won't automatically created by mongo, but mongo will
automatically try to parse the string that we passed in as a date into a real JS date. So in that array we could pass in an
element like: "2021-03-21" or "2021-03-21,11:32" and then mongo will automatically parse this string to a valid date. Or we can
input a unix timestamp like the format we have in Date.now() , So mongo will try to parse all of these date formats into a JS
date and only if it can't, it will throw an error.

Remember: When the schema is changed and some default fields have been added to the new schema, mongo will automatically update
all of the old docs, so now they have also those newly added with default option fields!

Virtual properties are basically fields that we can define in our schema but that won't be persisted. So they won't save into
database in order to save us some space but most of the time, we want to really save our data to db, but virtual properties make
a lot of sense for fields that can be derived from one another. For example a conversion from miles to kilometers. (We know that
miles and kilometers are derived from one another). So it doesn't makes sense to store these fields BOTH in the db, IF we can
easily CONVERT one to the another. Now let's define a virtual property that contains the tour duration IN WEEKS.So that's a field
that we can very easily CONVERT it from duration field that is currently in our model and it's IN DAYS (so we want to CONVERT it
to weeks-therefore we can use a virtual property).
Learn: For defining virtual properties on a schema, we must define them ON THE VARIABLE that contains the schema. In this case,
 that variable is tourSchema.
We pass in the NAME of that virtual property in .virtual() method.
Why we use .get() method on .virtual() in our code? Because that virtual property will be created each time that we get some data
out of database so that get() method called a getter and in that .get() method we pass a real callback function (NOT AN ARROW FUNCTION!)

Why we divide duration by 7? Because we want duration in weeks not days, so we divide it by 7.
Why we used regular function (a function with function keyword) in the callback for .get() ?
Learn: Because remember, an arrow function does not get it's own this keyword which in this case we want this keyword in the function.
 Because in that function, this keyword is going to point to the current document.
 So usually when we want to use this inside a function (doesn't matter in callback or normal function or ...), we should use
 the function with function keyword.
 Tip: In mongoose we usually use functions with function keyword.

So the durationWeeks field won't persisted in db, but it's ONLY gonna be there (in db) as soon as we get the data.
Now this virtual property won't be in the results and that's because we need to explicitly define in our schema, that we want the
virtual properties in our output. How we gonna do this? Remember that in parentheses of mongoose.schema() , we can pass in not only the
object which has the schema definition itself, but also an object for the schema options which is the second arg of mongoose,schema() .
So the first arg of mongoose.schema() is that large object which is the definition of schema itself (fields and their types and ...) and
the second arg is an object which has options for schema.
Now we can do our task in this second arg of mongoose.schema() .

In toJson we're saying: Each time that the data is outputted as json, we want virtuals to be true. virtuals to be true means that
the virtual properties must be part of the output.

toObject means when data outputted as an object, also we want the virtual properties to be in the results too.

Now by setting these, we should be able to see our virtual properties in results.

Important: We can't use virtual properties in queries to db. Because they're technically not part of the database. So we can't say
 for example: Tour.find({durationWeeks: 1})
Of course we could also do this conversion each time after we query the data, for example like in a controller, but that would not be
the best practice.Because we want to try to keep business logic and application logic as much separate as possible (fat models and thin
controllers- which says that we should have models with as much business logic as we can offload to them and thin controllers with as
little business logic as possible) , so virtual properties are a good example of how we can acheive that kind of architucture. Because
knowing the durationWeeks is a business logic, because it has to do with business itself(like the tour company!) and not with stuff
like requests(things that do in code and express.js are application logic). So we do the calculations for business logic in models and
not in controllers.

pre() middleware is gonna run BEFORE an actual event and that event in this case is save event and the callback function for this
.pre() method will be called before an actual document is saved(our event) to the db. So this is a document middleware which is gonna
run before the .save() and .create() command BUT NOT ON insertMany(). So if we use .insertMany() , the document middleware won't be
executed or in other words insertMany() won't trigger the save event document middleware.
So the document middleware will only be executed on .save() and .create() .

Learn: In a save middleware (a middleware which would trigger on the 'save' event), the this keyword is gonna point to
 the currently processed doc and this is the reason why it's called document middleware.
 So because in the callback function for .pre() method, we have access to the document that is being processed and in this case
 we have access to the document that is being saved with this keyword.

Now in order to trigger that callback function, we need to run a save() command or create() command. So we now need to CREATE
a new tour using our api in order to trigger that middleware (why create would trigger this callback function? Well as I mentioned
before, create and save commands would trigger this callback function or this middleware).
So now if you console.log(this) in that middleware and then create a new tour, it would log to console the document that was
created RIGHT BEFORE it SAVED into the database and because at this time we haven't save data to database we can act on the data and
the place that we act on data BEFORE it's saved to db is inside the callback function for .pre() .

Now in this callback function we want to create a slug for each of the docs.
Learn: A slug is basically just a string that we can put in the url, usually it's based on some strings like name.
In this case, we're gonna create a slug based on the tour name. So we must use slugify package as a dependency and then require it
in our model file.
For create a slug for the currently processed doc, we create a new property on the doc called slug and we assign slugify() to this
new property and in parentheses of slugify() we pass it the string that we want to create slug out of that string. So in this case
we want to create slug from the name property of each document. So we must pass this.name to slugify().
In our case, the second arg of slugify() is an option that is saying that everything should converted to lowercase.

In mongoose, each middleware function, like pre('save', function(){}) has access to next arg.

Remember: When you define some new fields for some docs or just one doc, THOSE NEW FIELDS WON'T PERSISTED TO THE DATABASE.
Because we didn't define them in our schema.So when you want to define some new fields for a doc or some docs, before that, you
must define those new fields in the schema and if you don't do this, those new fields won't persisted to db, but other fields for
newly created docs WILL persisted to db, because we have defined them in schema.
After setting up that mongoose middleware and slug property, we must define slug property which is in newly created docs in schema.
Now when you CREATE a new doc, this new mongoose middleware will triggered and it will create a new property on that newly created
doc called slug and the slug property on this doc is based on name property and the options that we specified in () of slugify()
with a little difference and that difference is when you have whitespaces in name property, instead, in slug property we would have
dash.

Important: Why we even use this mongoose middleware with save event and pre() method? We used it with pre() method because we want
 to define a field that it's value is BASED on another field that was sent by user. So we must FIRST get the value of that another
 field and THEN based on the value of that another field, we define the new field and THEN we save that doc to database.
 So now tell me! How you would define the value of that new field if you didn't define this middleware? (Remember that we don't want
 our client to send that slug property for creating the doc-we should create that property OURSELVES BASED ON THE PROPERTIES THAT
 THE CLIENT SENT TO US!)

In the callback function of post('save', function() {}) method, we have access to next and the document that JUST SAVED TO DB, with
specifying the name of that document in parentheses of callback.

Learn: post() middleware callback functions are executed after all of the .pre() middleware callback functions have completed.
 So in callback function of post() method, we haven't this keyword like we had in callback function of pre() access to this
 keyword which points to currently processed doc. Instead, in callback of post() we have access to FINISHED DOC by receiving that doc
 in parentheses of callback of post() by defining an argument.
 BUT I THINK WE ALSO HAVE ACCESS TO this KEYWORD IN post() callback function! Which is pointing towards the finished doc(in this case
 it's pointing towards saved document).
 Also remember that in both callback functions of pre() and post() , we have access to virtual properties. But those virtual props, won't
 stored in db.

'save' event also called a hook and we called that middleware a pre save hook or pre save middleware.

Remember: If you have a pre() and a post() middleware, you MUST call next() in pre() middleware and if you don't do this post()
middleware won't run and the request will stuck at that pre() method and also if you have multiple pre() or post() , you always
must call next() in each of them. So it's a good practice to call next() in each of mongoose middlewares.

Important: 'save' mongoose middleware only runs for .save() and .create() mongoose methods and it's not gonna run for .insertMany()
 and also not gonna run for findOne() and update methods or findBuId(). So we must find a workaround.

Query middlewares allow us to run functions before or after a certain query is executed. Let's create a middleware that's gonna run
before any find() or findById() or ...(find methods) query is executed.
Why it's called query middlewares? Because for the hook, we use find or update or ... which are like queries. In pre query middlewares
the this keyword will point at current query and not the current document, because in query middlewares we're not processing any
document and we're really processing a query!
So let's suppose that we can have secret tours in our database.Like tours that are offered to vip group of people and the public
shouldn't know about it. So we don't want our secret tours to appear on result outputs. So the solution is to create a secret
tour field and then do query ONLY for tours that are not secret. So if the secretTour field is true it means that tour if secret and
we don't want it to shows up and by default a tour is not a secret tour. So we say: default: false , remember that default means
the default VALUE of that field.

Learn: this keyword in a query middleware is pointing to current query object. So we can chain all of the mongoose methods that we
 have for queries.

Why in filter object in find query middleware, we used { $ne: true } instead of false? Because the older tours don't have the
secretTour field. In other words, we could just say: { secretTour: false } , but the way that we wrote the code is cleaner.

In our older tours they didn't have a secretTour field and we created this filed on the new doc and set the default value of that field(
secretTour) to be false. So because we didn't specify this field in our older docs, they haven't this field in database. But our newly
created doc have this field in db. Because we specify it for that new doc. BUT when you get all of the tours, because 1 doc HAVE that field,
mongoose will also give that field to our older docs TOO! So now they have that new field in results but they don't have this field in DB!
(It's kind of wierd!). Mongoose did this. So in database, secretTour field doesn't exist for older docs and it just exists for the
newly created docs. Mongoose is adding that field to the older docs in results, because we have defined that field in our schema and
that field won't be in database, so mongoose put that field in results and not db anyway!
Recap: When you hit a route, for example: .../tours using get http request, we create a query using Tour.find() (in getAllTours()
route handler) and then chain some methods to that query and then we execute that query. BUT BEFORE THE QUERY IS EXECUTED,
the pre find query middleware would be executed. Why this middleware and not other pre query middlewares? Because this middleware
is for 'find' hook and the query that would executed is also find() . So we created a find() query and therefore find hook would be
executed and in callback function of find hook, since we're at a query middleware, the this keyword is pointing towards the current
query. So in a mongoose query middleware , we can chain other mongoose methods to the current query. Like find() -like what we
did in our code and then we're saying: Just give me the docs that haven't secretTour field of them is set to true. So we're saying
just give me the public tours and not the secret tours.

Now there's one thing to fix. Because our query middleware with 'find' hook would only run for find() query and not findOne() .
So if we send a get request to '...?tours/<the _id of secret tour>' , it would give us the secret tour in result! and we set things
up in pre find mongoose middleware, so the tours that have secretTour set to true shouldn't appear in results and they would filtered
out IN ALL OF OUR ROUTES OR ALL OF THE REQUESTS THAT CLIENTS SEND TO SERVER, like get all of the tours or get one tour or ... .
But when you send a get request to '...?tours/<the _id of secret tour>' to check if we can get the secret tour separately, you notice
we can! And this is not good as I mentioned and this is because in the route handler function of this route we're creating query, using
findById() (which behind the scenes is findOne()) and this mongoose method does not trigger the mongoose middleware with 'find' hook,
so it won't filter out that secret tour and therefore we can get that secret tour. That's bad!
So we need to specify a same middleware also for findOne() mongoose middleware. There are 2 ways of doing that. The first one is to
copy the current middleware and just replace 'find' with 'findOne'. But it's not good. Instead we can use a regex.
In regular expression we want to say is that this middleware should be executed not only for 'find' but for all of the commands
that start with the name find. Like findOneAndDelete() and ... Now all of these commands will trigger the callback of that middleware.
Important: A regular exp shouldn't be in quotes or double quotes because it would evaluated as what it is! Not a really regex.

So with that regex, if you send a get request for getting a secret tour, it won't show that to you.

Learn: In post query middleware, we have access to all the docs that were RETURNED FROM THE QUERY and next.
Remember: The post query middleware is gonna run AFTER the query was executed, so because the work of query has finished, all of the
docs are arrived and we have access to them.

Aggregation middleware allows us to add hooks before or after an aggregation happens. In our code, currently if the user sends get request
to one of a routes that it's route handler functions, use aggregate() for queries, the secret tours also would be in results and we
don't want this. So we must also create some middlewares for aggregate queries and these middlewares are called aggregate middlewares.
Again why we want to use an aggregate middleware here? Because our secret tours are also be calculated in routes that their handler
functions are using aggregate queries. So we don't want our secret tours to go to these aggregate queries and like find() and findAnd...()
we want our secret tours to not go to these queries and stay hidden.
One solution would be to exclude the secret tours from filter object of $match stage in each route handler function that is using
aggregation. But with this approach, we would have some repetitive code. So instead of exclude them in route handler functions, let's
exclude them right at the model level by using aggregation middlewares.
In aggregation middlewares, pre() means before the aggregation executed, run this middleware.

Validation is basically checking if the entered values are in the right format for each field in our schema and also that values
have actually been entered for all of the required fields.
Remember: We do data validation in our model files and that's because of fat model and thin controller philosophy, which makes
model file a perfect place for data validation.
For example required option in schema is a built-in validator for mongoose but unique option, technically is not a validator.
But it will still throw an error when we have a duplicate value for that field, but again that is not really a validator.

Another validator which is specifically for Strings, is maxlength and minlength. These validators are working for the patch request
for '.../:id' route, because in it's handler function we set runValidators: true . But we don't need to set this option for other mongoose
queries like find() or delete() or ... (Just the ones that have update in them)
Learn: Update validators are off by default - you need to specify the runValidators option.

Golden security notice: Never ever accept data coming from a user as it is. So we always need to sanitize that incoming data.

On Strings we have maxlength and minlength and on numbers and dates we have max and min.
Learn: enum validator is only for Strings.

Learn: [true, 'A tour must have a difficulty.'] notation is a shorthand for an object of stuff and that object would be :
{
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty must be either easy, medium or difficult.'
}

On Strings we have other validator like match validator which checks if the input matches the given regex.
A validator is just a simple function which should return either true or false and if it returns false, it means there's an error.

For creating your own validator, first make sure you are in the object for the value of that field. So if that field was sth like
this: field:<type> , change it to
 field: {
  type: <type>,
  validate:
  {
    validator: <the normal callback function(not arrow function)>,
    message: <the error message>
  }
 }
Why a normal function? Because in that validator we're gonna using the this keyword which would point to the current DOCUMENT. But
if you don't use this this keyword, you could use an arrow function instead. So for example in priceDiscount field, we have
access to the priceDiscount that user sent to us and we can receive this current value by specifying a parameter when declaring
the callback function.In this case we named it val.
Important: In our custom validators we always need to return either true or false based on some conditions.
In our case, we said price (actually this.price, because we want to compare the CURRENT doc, right?) should be always greater than
priceDiscount, which is currently in val parameter. Why we didn't write it other way? So like this.price < val ?
In the prior example, it would return false. But it doesn't matter how you write it! We just wanted to write the code that shows
the correct condition.(The correct condition was price property of current doc must be greater than it's priceDiscount.)
But it doesn't matter anyway. The validator will run if the user sent priceDiscount in his request.
In this callback function we have access to the value that was inputted.

Also the message property in the value of validate property which it's value is an object, has access to the current value and
this works in a weird way because internally it's mongoose not JS. So we can use simply curly braces and then VALUE. So
VALUE is exact as val in parameter of function. But remember because we aren't inside the callback function, in the value of
message property, we can't use `${}`. Right? But still we have access to current value.

For specifying our own validator, you must use validate key name. Like the above example.

Important: Inside the callback function of validator property, the this keyword is only gonna point to the current value of that field
 in document, when we're CREATING A NEW DOCUMENT. So that callback function won't work on update or like that queries. But we can fix
 this but it's complicated. But of course we can write validator functions that aren't rely on this keyword in their code.

Also there's a library called validator in npm that we can use it for custom STRING validators that we don't need to write them ourselves.
In isAlpha() method in validator package, numbers and underline and dash and even whitespaces are also invalid. So we commented out in
name field in our schema!

Important: You shouldn't CALL the methods on validator object. So don't use parentheses when using validator in schema options.
 And also we din't call our custom callback validator functions.

Learn: There's 2 ways of specifying the validator function (our own or built-in or 3rd party doesn't matter in this case) and the error msg.
 One way is to use them in an array(the shorthand)- So like this: [<the validator function>, '<error msg>'] OR the second way is:
 validate: {
  validator: <the callback function>,
  message: <message>
 }
*/

/* Remember: For using async await, you must create a function. Right? Because async is usually used in declaring function itself. */
/* Model layer is concerned about the data and the business logic. In controller layer, handles application's request, interact with
* models and send back responses to the client (app logic). View layer is necessary if we have graphical interface or if we're building a
* server-side rendered website (persentation logic). */
/* Everything starts with a request. Then that request will hit one of our routers. Because we have one router for each resource.
* Now the goal of the router is to delegate the request to the correct handler function and that function will be in one of the the
* controllers and we know that there will be one controller for each resource. Then depending on the request, the controller might need
* to interact with one of the models and again there is one model file for each resource. After getting data from the model,
* the controller might then be ready to send back a response to the client.
* But in case that we want to render the website there is one step involved. In this case after getting the data from model,
* then the controller will select one of the view templates and inject the data from model to it and that rendered website will send
* back as response.
* In view layer, usually there's one view template for each page.
*
* MVC separates business logic from application logic.
* application logic is code that is only concerned about the application's implementation and not the underlying business problem
* that we're trying to solve with the application, like showing and selling tours.
* So application logic is the logic that makes the app actually work. For example, a big part of application logic in express is
* all about managing requests and responses. So application logic is more about TECHNICAL STUFF. Also if we have views in our app,
* the application logic serves as a bridge between model and view layers. So we never mix business logic with presentation logic.
*
* About business logic, it's the code that actually solves the business problem we set to solve.For example, our goal is to show
* tours to customers and then sell them and the code that is directly related to the business rules or to how the business works
* and the business needs is business logic. EX) Creating new tours, checking if user's password is correct, validating user's input
* data, ensuring only users that bought the tour can review it and ...
* So we must do our best to keep application logic code in controllers and business logic code in models.
*
* Fat models/thin controllers: We should offload as much logic as possible into the models, to keep the controllers simple and lean.
* So the controllers are mostly for managing app's requests and responses.   */
/* Mongoose is just a layer of abstraction on top of mongodb, which is why mongoose doesn't use the exact same functions, but
still it gives us access to similar ones or some exact function names, like deleteMany() which has a same name in native
mongodb. */
/* In mongoose there are 2 ways of writing db queries.The first one is to just use the filter object and the
second one is to use some mongoose special methods. So we chain special mongoose methods to build the query.
EX for first way:
const tours = await Tour.find({
  duration: req.query.duration,

});

EX for second way:
const tours = await Tour.find().where();


*/
