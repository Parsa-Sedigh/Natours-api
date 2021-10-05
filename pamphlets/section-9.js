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

87-5. Creating Documents and Testing the Model:
Let's create a doc out of a Tour model(or function constructor). So this is kind of using JS function constructors or JS classes(if
you're using ES6), basically to create new objects out of a class and so that's exactly the same syntax, so we use the new keyword and then
the class name in ES6. Now here it's NOT exactly the same, but this analogy is helpful to understand how this works.
So this testTour doc that we created, is an instance of the Tour model and so now it has a couple of methods on it that we can use in order to
interact with the DB. Like <created doc>.save() to save it to tours collection in the DB. So we can call the save() method on our document instance.
Now that .save() returns a promise that we can then consume.

For using async await(in order to consume promises), we need to create another function.

In .then() of testTour.save() we have access to the document that just saved in the database. So basically we have access to the
resolved value of the promise that .save() returns, is the final document as it is in the DB.

Important: Mongoose by default produces a collection name by passing the model name (first arg of .model()) to the
 utils.toCollectionName() method.
 Also note that mongoose automatically creates a new collection as soon as we create the first document using that model.
So if we hadn't a tours collection which is related to Tour model and then we insert a document in that collection(which that collection
doesn't exist yet), that collection with it's new doc, will be created automatically in DB and the name of that collection is automatically
guessed based on the name of MODEl. So if the model name is `Tour`, the collection name would be `tours`(it makes it plural automatically).

By saving the file, this code will be executed right away, because it won't be executed by some reqs which is the case that normally happens
in APIs, instead, it will be executed right away. So each time we save our files, that code in our model which is saving a doc to db, is
executed again(of course we would remove this code later). But because we made the `name` field unique, we get an error that says the
name is a duplicate key.

Mongoose add __v field automatically to each doc that was inserted.
If the collection doesn't exist when we create the first doc for that collection, mongoose will automatically create it for us.

With this code, we inserted a doc into database VIA OUR CODE.
The explanation of code is: When you created the model, you must create an instance of model and that instance would be the new
document and then pass in Tour() the fields and values for that document and then you must save that document.Like below:

const testTour = new Tour({
  name: 'The Park Camper',
  price: 497,
  rating: 4.4
});

Remember: For using async await, you must create a function. Right? Because async is usually used in declaring function itself.

88-6. Intro to Back-End Architecture MVC, Types of Logic, and More:
MVC architecture in our express app:
Model -> Buisenss logic
controller -> application logic
view -> presentation logic

In this architecture, the model layer is concerned with everything about application's data and the business logic.

In controller layer and the function of the controllers is to handle the application's request, interact with models and send back responses
to the client and all that is called the application logic.

View layer is necessary if we have a graphical interface in our app or in other words, if we're building a server-side rendered website.
In this case, the view layer consists basically of the templates used to generate the view(so the website that we're gonna send back to the
client.)(presentation logic).
For now, we're just building an API though, so we're not really concerned about views just yet.

We could add more layers of abstraction here.
Now let's take a look at MVC in the context of our app and the request/response cycle.
So as always, it all starts with a request. Then that request will hit one of our routers(because we have MULTIPLE routers).
In other words, because we have one router for each resource.
Now the goal of the router is to delegate the request to the correct handler function and that function will be in one of the the
controllers and we know that there will be one controller for each resource. Then depending on the incoming request, the controller might need
to interact with one of the models and again there is one model file for each resource. After getting data from the model,
the controller might then be ready to send back a response to the client, for example, containing that data.
But in case that we want to render our website there is one step involved. In this case after getting the data from model,
the controller will then select one of the view templates and inject the data from model to it and that rendered website will then be sent
back as the response.
In the view layer, in an express app, there's usually one view template for each page. Like a tour overview page, a tour detail page or a login
page.

- Application vs business logic:
Let's go into a bit more detail on model and controller.

One of the big goals of MVC, is to separate business logic from application logic. But what are these types of logic?

Application logic is code that is only concerned about the application's implementation and not the underlying business problem
that we're actually trying to solve with the application, like showing and selling tours, managing stock in a supermarket.
So application logic is the logic that makes the app actually work. For example, a big part of application logic in express is
all about managing requests and responses. So application logic is more about TECHNICAL STUFF. Also if we have views in our app,
the application logic serves as a bridge between model and view layers. So that we never mix business logic with presentation logic.

About business logic, it's all the code that actually solves the business problem that we set out to solve. For example, our goal is to show
tours to customers and then sell them and the code that is directly related to the business rules, to how the business works
and the business needs is business logic.
EX) Creating new tours in the app's DB, checking if a user's password is correct when he logs in, validating user input data or ensuring that
only users who bought a certain tour can review it and ... , so all this stuff is concerned with the BUSINESS itself and so it's part of the
buisness logic.

Keep in mind that application logic and business logic are almost impossible to completely separate and so sometimes they will overlap.
But we must do our best to keep application logic code in controllers and business logic code in models and there is even this philosophy of
Important: fat models/thin controllers which says: We should offload as much logic as possible into the models, to keep the controllers simple and lean.d
 So a fat model will have as much business logic as we can offload to it and a thin controller will have as little logic as possible,
 so that the controller is really mostly for managing the application's requests and responses.

application logic                                             CONTROLLERS    <------>   MODEL   business logic
- code that is only concerned about the application's implementation,                 - code that acatually solves the business problem we set out to solve
  not the underlying business problem we're trying to solve(e.g. showing              - directly related to business rules, how the business works and
  and selling tours)                                                                    business needs
- concenred about managing reqs and responses                                         - examples:
- about the app's more technical aspects                                                  creating new tours in the DB
- bridge between model and view layers                                                    checking if user's password is correct
                                                                                          validating user input data
                                                                                          ensuring only users who bought a tour can review it
*/
/* 89-7. Refactoring for MVC:
Currently we have controllers folder and routes folder, so now we need a models folder. So create that and create the tourModel.js there, then
cut the code wrote for tourSchema and mongoose.model() that we have in server.js , to that tourModel file.

All we have to do in server.js is to connect to db, but everything that is about the models will always live inside a file in models folder.

At last, we must export our model from model files and that should be the ONLY thing we export from model files and so we use the default export
for doing that with mode.exports = ... , to use it (querying, deleting and ... docs) in the related controller file.

Now where do we need that exported tour model? In other words, where are we actually gonna create and delete and ... tours(docs of that exported
model)?
In tourController and there, we import the exported model with the same name. For example the model is named Tour amd we import it with the name,
Tour.

Now in tourController, clean the code we wrote before in order to no longer depend on the data that we had in the JSON file, because now we wanna
work with real DB.

Also we no longer need checkId() function in tourController, because from now on, we're gonna start working with the IDs that are coming from mongodb,
because mongo itself, will give us an error if we use an invalid id, so that checkId() function was very useful for showing you how middleware actually
works.
So comment checkId() out.

Now in tourRoutes.js , comment out the router.param('id', tourController.checkId)
Remember: We use router.param() to define parameter middleware.

Now we wanna create the controller functions or handler functions in tourController with mongoose.

90-8. Another Way of Creating Documents:
Comment out the checkBody() function, it was to validate the body, so to see if it had the name or the price property in them, but now,
our mongoose model is gonna take care of that. Also comment it in tourRoutes.

We can create a new do like:
First approach:
EX) const newTour = new Tour({
      name: req.body.name,
      price: req.body.price,
      rating: req.body.rating
  });
  newTour.save().then();

This code will work but there's an easier way:
Second approach:
EX) Tour.create({})

The difference is in second approach, we call the method (save()) on new DOCUMENT, but in the next approach we call the method (create())
DIRECTLY on MODEL itself instead of calling the method on the instance of model which is our new document. These are completely different.
So again we had the tour document that we created from the model(by using new <model>()) and on that new document variable, we used the save() method ,
because the document has access to save() and a lot of other methods as well.

But in second approach, we call the method(create()) right on the MODEL(and not document) itself.

In Tour.create(), because .create() returns a promise, in order to access the document that was created inside db, we must
use .then() . But it's better to use async await. So we are waiting for the returned promise of .create() and save the resolved value
of this promise to newTour variable.

Remember: If eslint gives an error that says: The async functions are not supported until node 7.6.0 . The configured version range is
'>=6.0.0' , or sth like this, this is because of node plugin that we installed. So go to package.json and in there define
the node version that you're using. So after devDependencies, say:
"engines": {
  "node": ">10.0.0"
}
So this means in this project, we're using at least version 10.0.0 . Yes, 7.6.0 would be ENOUGH in order to make that eslint error disappear,
but of course we specify the real version that we're actually using.

But with even specifying ">7.6.0" it's enough to make this error disappear. But it's better to specify the real version of node
that you're currently using.

Learn: When the client send additional fields that aren't in the schema, those additional fields and values will ignored by
 the schema and won't inserted into db.

In this function, we're creating docs, USING MONGOOSE.

Remember: With using async await, we need to test for errors by using try catch syntax.
In catch block we have access to error object, by specifying a name for argument that stores the error object.
Also in catch block, we need to think what the errors would be? One error would be the request didn't provide all of the
required fields that we specify in schema and that's a validation error and that can be catched in .catch().
Because if we try to create a doc without one of the required fields, then the promise that is returned from .create(),
would be rejected and if we have a rejected promise, it will enter the catch block.
Learn: Rejected promises will enter the catch block.
Learn: 400 status code means bad request.

Everything that is not in our schema, is simply ignored, so if client sends some data that aren't in the related schema, those data are ignored.
So that is the power of schema!

Mongodb gives back a huge error object in that catch block and later on we will create more meaningful errors.
This is how we create docs using mongoose.*/
/* 91-9. Reading Documents:
try {
  const tours = await Tour.find();
  res.status(200)...
} catch(err) {
  res.status(404)...
}

We use the data property which is an object in the response we send to client, in order to envelope the data, like when getting tours, we envelope
them with data property which has an object as value.

In this case, there's not gonna be any validation errors that could be catched in catch() block(unlike creating docs).

findById() is a shorthand or a helper function for findOne() method with a filter object. So we could also say:
Tour.findOne({ _id: req.params.id }) So findById() is a shorthand for writing the filter object in findOne() and behind the scenes
the findByID() will work exactly like findOne(). So:
Tour.findOne({ _id: req.params.id }) === Tour.findById(req.params.id);

92-10. Updating Documents:
We can query for the document that we want to update and then update it, with ONLY 1 command in mongoose.

In third arg of findByIdAndUpdate(), we can also pass in an object of options and in there we can set `new` property to
true and by setting that property to true, the new updated document is the one that will be returned from that method
rather than the original doc and since we want to send back that updated document to the client, we always want this method to
return that updated(new) doc. We must store that returned doc into a variable by awaiting it.

All of the find() , findByIdAndUpdate() , findById() , all of these, will return queries, so they are query methods.

findByIdAndUpdate() is just a shorthand for findOneAndUpdate() , where we're querying for an id

With setting true for runValidators option, each time that we update a certain doc, then the validators that we
specified in the schema will run again.

Learn: When we say: <sth>.prototype. ... , it means an object that was created from a <sth>. For example:
 Tour.prototype.save() means an object created from Model class. So Mode.prototype.save() method in mongoose refers to a save() method
 called on a DOCUMENT and NOT on a Tour Model class, which is an object from Model class.
EX) When we have:
const newTour = new Tour({});
newTour.save();

This newTour got ACCESS to the save() method, because save() is part of the prototype object of Tour class.
Important: So again, when you see Model.prototype.save() , you know that the save() method is gonna be available on ALL of the INSTANCES created
 through a Model and not the Model ITSELF, but from it's INSTANCE. So if for example you try Tour.save() , it would give you an error.
In other words:
Important: So in mongoose when you see Model.prototype.save() we find out that the save() method is going to be
 available on all of the instances created through the Model class and save() it's not available on Model itself.
 So if you try to write Tour.save() it would give an error, but if you use .save() on a document (an object) created through
 the Tour, then it would work.

Methods like findById() or update() or ... will return query objects.

Instead of tour: tour we in an object we can say: tour.
Remember: In updating a doc, if you send additional fields that curr aren't exist in database, they would be ignored.

Because of runValidators: true , if we send String Instead of Numbers when updating docs, it would give us an error. Because
it would look at the schema for data types.
Also because for updating we're using PATCH HTTP method, the original doc wouldn't replaced by the new object that we sent in.
But if we were using PUT request, the original object (doc) would completely replaced with the new one that is sent in and in
that case it won't work with findByIdAndUpdate() method. Because this method updates the fields that are different in body
and in db.

For example findByIdAndUpdate() or find() or findById() , all of these, will return "query objects" and so later on when we're gonna implmenet
stuff like sorting or filtering, we will then use this query object.

If you update a field to a type other than the specified type in schema and you have set the runValidators: ture, it would throw an error.
Because we ran the validators again.
So when we have in req body of an update endpoint sth like: price: "some price" , mongoose can't convert this string to a number, so it throws an
error.

In PUT req, we expect to get the FULL object coming from req.body, so in this case, the original object would be COMPLETELY replaced with the
new one that is sent in from req.

findByIdAndUpdate() updates the fields that are different in the body of req.

93-11. Deleting Documents:
We didn't save the result of awaiting in await Tour.findByIdAndDelete(req.params.id); to a variable, because we don't send anything back to the client,
so in a restful API, it is a common practice NOT to send back any data to the client, when there was a DELETE operation and 204 status is
kind of a standard for deleting.
Also note that in case of deleting, postman doesn't show anything as body of response.*/
/* 94-12. Modelling the Tours:
If a field must have a value of pre-defined possible values for example it should be either 'medium', 'easy' or 'difficult', that is a VALIDATOR.

About ratings, later we would have another resource called reviews, where users will be able to write reviews about tours and give
ratings and that's gonna be a completely different resource, so it would have a different model. BUT still we want to have a summary of
these ratings and of these reviews which are in a different model, in this tour model. SO THIS APPROACH IS ACCEPTABLE.

We didn't gave those 2 ratings fields(ratingsAverage and ratings(Quantity) a required validator. Because it's not the user who creates
these tours who will actually specify the ratings values. So when we create a new tour, we will never specify the ratingsAverage neither the
ratingsQuantity, because that will LATER ON will be calculated from the real reviews.

When we have sth like: <field>: <type> , we didn't give it any schema type options.
We make the summary field required, because it's on the front page of our website, so basically it's on the overview.

trim schema type option only works for Strings which will remove all the whitespaces in the beginning and in the end of the string.
(So remember that I said there are different schema types (options) for different types and for string we have a schema type which is
trim). So if for example someone sends sth like: "     This is good.     ", then all that whitespaces will get cut.

The summary schema option is required because it's on the overview page and we defenitly want to show it.
imageCover is just the name of the tour image and we will read the image from the file system. But in db we just store the name
of the image as a reference.

Learn: We could store the entire image in database as well, but it's not good. We leave the images somewhere in the file system
 and then put the name of the image itself in the db as a field.
So the name of the image is kinda a reference of that image will be stored in the DB and that's a common practice.

In images schema option, we would have multiple images, so we must save those images as an array of Strings. So we must specify
an array of strings ([String]) for that field value, instead of an object of schema options.
So in schema, [String] means a number of strings in an array.

The type of field is also itself an schema type option.

The createdAt field should be a timestamp that is set by the time that the user adds a new tour.
Date is a JS built-in data type. Date.now() will give us a timestamp in milliseconds, which represents the current milliseconds.
But in mongo, this millisecond(Date.now()) will immediately converted to today's date, in order to makes sense of that data.
createdAt should be added automatically at time that the tour(row) is created.

startDates are different dates at which a tour starts. For example we can have a tour starting in December this year and then in Feburary the next
year and ... , so different dates for the same tour , are simply different, let's say, instances! of the tour starting on different dates.
But that startDates won't automatically created by mongo and mongo will then automatically try to parse the string that we passed in as
a date into a real JS date. So in that array we could pass in an element like: "2021-03-21" or we can also specify the TIME
of that date "2021-03-21,11:32" and then mongo will automatically parse this string to a valid date.
Wwe could also input a unix timestamp like the format we have in Date.now() and so mongo will try to parse ALL of these date formats into a JS
date and only if it can't, it will then throw an error.

Now for testing the new model, we can grab a tour from dev-data folder and pass it in the req for testing the creation of a tour, instead of
writing all of it manually(remember to remove the id, because we needed before when we were doing our file-based API).

Important: When the schema is changed and some fields with default values have been added to the new schema, mongo will automatically update
 all of the old docs, so now they have also those newly added with the defined default values!

We wanna write a script which will automatically import all of the tours from tours-simple.json . So it will read the file and get all
the tours and import them into the DB.

95-13. Importing Development Data:
We wanna load the data from the JSON file into the DB and this script is completely independent of the rest of our express app and so we will
run this compltely seprarately, from the command line, just to import everything, once. We can create the file for that script in
dev-data/data folder.
In that file, we need the dotenv package, because we need our env variables in order to be able to connect to the db again.
In this file we also need to connect do db again, because this file runs completely independent from our express application. It's only
gonna run once in the beginning.
This file will only run once in the beginning.
Important: We also need the tourModel file because that file is where we want to write our data to.

<Model>.create() method accepts an object. But it can also accepts an array of objects and in that case, it will create a new doc for
each of the objects in the array.

Remember: When you read a file which has json file, the variable that we store the result of fs.readFileSync() would be JSON,
so after reading the file, we need to convert the data of that file into a valid JS object, by using JSON.parse() on the file.
Important: In first arg of readFileSync() or './tour-simple.json' the dot is always relative to the folder where the node
application was actually started. So the dot would point to the home folder, so now we're looking for this file in the home
folder, so it would give us an error.So we must use __dirname which is available for us everywhere.

Now what about the data that is already in the database?
We can create an easy way to basically delete all of that data at the same time. So let's create a function for this as well named deleteData() .

With deleteMany() and not passing anything to it, it would delete all of the docs in a certain collection that we're calling deleteMany() on it.
This mongoose's function do exactly the same as deleteMany() in native mongodb.

Now we could call importData() and deleteData() just like this in that file, but we wanna do this by interacting with the command line.
So we're gonna run that file without calling any of those functions.

The ./ is always relative from the folder where the node application was actually started. So if you run node command from the home folder,
./ would point to the home folder.
So in import-dev-data.js , instead of . in path we pass to readFileSync() , we should use __dirname which is available to us everywhere.

Important: When you're running node command, the current directory that you're in is very important.
 __dirname is always the directory in which the currently executing script resides. So if you typed __dirname into
 /d1/d2/myscript.js, the value of __dirname would be /d1/d2. By contrast, . (dot)gives you the directory from which you ran
 the node command in your terminal window. BUT WE HAVE AN EXCEPTION FOR dot (.) INSIDE require():
 If inside dir2/pathtest.js you have a require call into include a file inside dir1 you would always do:
 require('../thefile') .
 Because the path inside require is always relative to the file in which you are calling it. It has nothing to do
 with your working directory.

So for running import-dev-data.js file from the root of the project, we must run the command: node ./dev-data/data/import-dev-data.js

So we learned that ./ is always pointing to the current working directory except in require(). The require() function,
translates ./ to the directory of the current file (where the script is located).

You can call the functions in import-dev-data.js, but let's work with terminal. So we can set things up so when we enter some options when
running the node command, one of our functions will be called and for other option, other function will run.

process.argv is an array of 2 arguments that are running the node process. The first element in that array is where the node
command is located(so it is equavilant to where the `node` command(which is the first keyword we used in terminal to run program) is stored and
and the second element in the array is where the script file is located (not the current working directory!)
Now when you want to run: node <path from current working directory to where the scripts file is located> , you can specify some
options in end of the command. So let's say: node ./dev-data/data/import-dev-data.js --import . Now in process.argv we have 3
elements in array. 2 of them are repetitious, but the new one is the option that we put for running the node command which in this
case is --import.

First run the --delete one and then --import . So we first get rid of old docs.
So run dev-data/data/import-dev-data.js --import (or --delete)

In terminal we can use -- to specify the options.

In our simple command line app, it will import the data when we specify the --import option when running that file with node, and will
delete the data when we specify the --delete option in cli.
So based on some conditions, now we can call our functions in that file.

Now after running these commands, our process would still be running, so let's fix that.
process.exit() is kind of an aggressive way of stopping an application. But in this little script, it doesn't matter. It wasn't
really matter to add this method here in our code, but it makes our lives a bit easier so we don't need to use ctrl+c to
exit the application after the node command has finished. Also I put this process.exit() outside of try catch block, because
with this, no matter there's an error or not, the process.exit() will always executed.

Now we deleted the old docs from db and then, have imported our data in db that we can start working with them.*/
/* 96-14. Making the API Better Filtering:
We wanna implement a couple of common api features, that make api more pleasent to use.

Let's allow user to filter the received data using query string.
So filtering makes sense on getAllTours() in our API. Why?
Because this is the endpoint that gets ALL the tours and so we want to allow the user to filter the data, so that instead of getting all
the data, he only gets the data that matches the filter. So like this, we can basically allow the user to query the data in a easy way, using the
query string. You can specify the query strings in `Params` tab of postman
So here we want to allow user to filter data, so he will get only the data that matches the filter.
A query string starts with a question mark and then user can specify some field-value pairs.
Now we must access the query string in express and in express the data in query string are on req object and then
the query property

Important: When you have an async function, if you're awaiting all of the promises that are inside of the total async function AND
 IF Total function doesn't return a promise itself, you don't need to use await on the calling code and wrap it again in a function
 with async keyword. That's why when we're calling this function in tourRoutes we didn't use await or ....
When we don't pass anything into find() method, it will return all the documents in that collection.
So it's like kind of: First we build the query and then we execute the query with await keyword. Why we can build
the mongodb query from query string? Because the query string is almost identical to native mongo queries. So with
some changes we can filter the data using the query string.

Let's say the query string is : ?difficulty=easy&duration=5
We can access the query string with req.query .

It's crucial to put dotenv.config() BEFORE const app = require('./app') in server.js .

In mongoose, there are actually two ways of writing db queries. The first one is to just use filter object and pass it to find() and ..., so
again, it works the exact same way as with a normal mongodb query and then the second way is to use some special mongoose methods.
For writing db queries in this method we can eiter say:
approach 1:
const tours = await Tour.find({
    duration: req.query.duration,
    difficulty: req.query.difficulty
});

Or either:
approach 2:
const tours = await Tour.find()
                        .where('duration').equals(req.query.duration)
                        .where('difficulty').equals(req.query.difficulty);

In second approach, we chain some special mongoose method to basically build the query.

Other mongoose methods are: lte(), let(), gt() (these are like where()) and we can also sort the results or limit the number of results and ... .

Currently, the req.query looks a lot like the object that we pass to find() in approach 1 . So we used approach 1.

Remember: find() will return an object which is a Query (So in this case <model>.query will also return a Query),
so that's why we can chain other mongoose methods to this code. So on Query.prototype we have a lot of methods like gte,
sort, where and ... .
Query.prototype refers to objects that we're creating using Query class.
Important: As soon as we await the result of query, the query will then execute and come back with the docs that match our
query. So if we do it like this (using await), then there's no way of implementing sorting or pagination or all of those
other features. So we must save the part of query into a variable and in the end after we apply all of the methods we want
to the query, we can await the query and receive the docs.
So if we await the result of query immediately it would be impossible to sort or limit or use any other method on query.

Now we implemented with .find(req.query), but this approach is too simple. Because later on, we will have other query parameters like
for example, sort for sorting functionality, or page for pagination and so we need to make sure that we're not querying for these
in our DB. So if we had page=2 as query string, currently, we would not get any results if we have a key-value pair in query string
that has nothing to do within the db, then we shouldn't look for that key-value pair in db. BUt with this approach, we WOULD
query for that key-value in db even it hasn't anything to do with db, like pagination. So if the user request the api with
query string of ?page=2 , with this implementation (.find(req.query)), we would query the database for page=2, but as we
know there isn't any doc in collection that has page=2, so the response would be nothing!

So when there's page key-value pair in query string or a few other key-value pairs, we don't want to query db with these
key-value pairs! But with this implementation we would. So it isn't a good implementation. So we must exclude these SPECIAL
field names from our query string, BEFORE we actually do the filtering (query the db under a condition).

For doing this task, we must create a shallow COPY of req.query object. So let's create a new variable that gets a COPY of
req.query and not the req.query itself. The variable is queryObject. For this variable we really need a hard copy of
req.query and we can't just do: const queryObject = req.query; (assigning req.query to queryObject).Because in further code
we would exclude (delete) some properties from queryObject and with this, those properties from req.query would ALSO BE
DELETED (but we don't want this!Because req.query must show all of the key-value pairs from query string not some of them!)
and that's because:
Important: In JS, when we set a variable to another object or in other words, assign an object to a variable, that variable
 would be a reference to the original object. So if you delete something from the variable that we assign the object to it,
 those properties from the object would be deleted too. So we need to pass a hard copy of req.query to the variable.
So we need a hard copy.
So we can use destructuring of an object(with ...<object>) and then create a new object out of that by adding curly brackets around it({...<object>})
Important: The destructuring will basically take all of the fields out of the object (copying the key-value pairs) and with
 curly braces we're creating a new object.
So with this code, we have a new object(not a reference to original object) that is going to contain all the key-value pairs that were in req.query object.
EX) const queryObj = {...req.query}
After this let's create an array that is like a list of the parameters that we want to exclude from query string.

We use .forEach() because we don't want to save a new object.

Now we delete the all of the fields from our queryObj, so we loop over the fields we wanna delete from queryObj and then we use the delete operator.

Now we exclueded the key-value pairs that we don't want in queryObj.
Now even by sending page=2 query string, the results won't be empty, because we would exclude that page=2 from our filter query.
So our filter feature ignores the page, sort and limit fields.

The find() method is gonna return an object which is a Query and on Query.prototype , we have a lot of methods in mongoose
like where() , gt() , sort() and ... and that is the reason why we CAN then chain other methods like .where() or .equals() or ... .

Query.prototype refers to objects that we're creating using the Query class. So this is the reason that we can do this chaining.

As soon as we actually `await` the result of query like await Tour.find() , the query will then execute and come back with the
docs that match our query and so if we do it like this(like await Tour.find()), then, there is no way of later, implmeenting sorting or
pagination or all the other features. So instead, we need to save the Tour.find() part into a query and then in the end, as soon as we
change all the methods to the query that we need to, only then by the end, we can `await` that query. For example we're gonna use the
sort() method or project() or limit() and we're gonna chain them to this query(Tour.find(queryObj)) and that would be impossible to do if we
await the result of the initial query(which in this case is Tour.find()) right away.

So instead of writing this:
EX)
const tours = await Tour.find(queryObj);
we say:
const query = Tour.find(queryObj);
or
const query = Tour.find()
                  .where('duration')
                  .equals(5)
                  ...

const tours = await query;

So build the query and after working with it, we execute the query. */
/* 97-15. Making the API Better Advanced Filtering:

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
into query strings..*/



/*
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
