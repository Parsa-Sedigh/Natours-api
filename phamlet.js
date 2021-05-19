/* SECTION 1. Welcome, Welcome, Welcome!:
1-1. Course Structure and Projects:

2-nothing

3-3. Let's Install Node.js:
*/

/* SECTION 2. Introduction to Node.js and NPM:
4-1. Section Intro:

5-2. What Is Node.js and Why Use It:

6-3. Running Javascript Outside the Browser;

7-4. Using Modules 1 Core Modules

8-5. Reading and Writing Files:

9-6. Blocking and Non-Blocking Asynchronous Nature of Node.js:

10-7. Reading and Writing Files Asynchronously:

11-8. Creating a Simple Web Server:

12-9. Routing:

13-10. Building a (Very) Simple API:

14-11. HTML Templating Building the Templates:

15-12. HTML Templating Filling the Templates:

16-13. Parsing Variables from URLs:

17-14. Using Modules 2 Our Own Modules:

18-15. Introduction to NPM and the package.json File:

19-16. Types of Packages and Installs:

20-17. Using Modules 3 3rd Party Modules:

21-18. Package Versioning and Updating:

22-19. Setting up Prettier in VS Code:

23-20. Recap and What's Next:
*/

/* SECTION 3. Introduction to Back-End Web Development:
24-1. Section Intro:

25-2. An Overview of How the Web Works:

26-3. HTTP in Action:

27-4. Front-End vs. Back-End Web Development:

28-5. Static vs Dynamic vs API:
*/

/* SECTION 4. How Node.js Works A Look Behind the Scenes:
29-1. Section Intro:

30-2. Node, V8, Libuv and C++:

31-3. Processes, Threads and the Thread Pool:

32-4. The Node.js Event Loop:

33-5. The Event Loop in Practice:

34-6. Events and Event-Driven Architecture:

35-7. Events in Practice:

36-8. Introduction to Streams:

37-9. Streams in Practice:

38-10. How Requiring Modules Really Works:

39-11. Requiring Modules in Practice:*/

/* SECTION 5. [Optional] Asynchronous JavaScript Promises and AsyncAwait:
40-1. Section Intro:

41-2. The Problem with Callbacks Callback Hell:

42-3. From Callback Hell to Promises:

43-4. Building Promises:

44-5. Consuming Promises with AsyncAwait:

45-6. Returning Values from Async Functions:

46-7. Waiting for Multiple Promises Simultaneously:
*/

/* SECTION 6. Express Let's Start Building the Natours API!:
47-1. Section Intro:

48-2. What is Express:

49-3. Installing Postman:

50-4. Setting up Express and Basic Routing:
Let's create a simple server and do some basic routing.

Linting is just to fix some errors.

The first thing that we usually do with in a new project is to create the package.json file and the command for that is
npm init and remember the na,e of project(actually the package name) can not have any capital letters. The entry point of our project
is not index.js but app.js .
To install express version x, in terminal we can say: npm i express@x and that will install the latest version INSIDE of x. So if you
write: npm i express@4 , it will then install the latest version inside of 4. So with the latest minor and patch versions. The version
for tutor is 4.16.4 .

Now create app.js . It's kind of a convention to have all the express configuration in app.js .
After importing express, create a variable called app in app.js which is kind of a standard and assign it the result of calling express() .
express variable(the variable resulting of requiring express package) is a FUNCTION which upon calling, will add a bunch of method to
our app variable there and the first one that we're gonna use now, is listen() function in order to start up a server. So that is a
bit similar to what we did before with the http package in the previous sections. So express is 100% nodejs under the hood and some
of the things work in a very similar way in express. In app.listen() , we pass in the port and let's actually create a variable for that
before that line of app.listen() in app.js for now and we're gonna change it a bit later and then pass in a callback function which
will be called, as soon as the server STARTS listening. So now our server is now listening.

Now what we need to do next is to define route.
Routing means basically to determine how an application responds to a certain client request, so to a certain url and actually it's not
just a url, but also the http method which is used for that request. For that we use app(variable which is the result of calling express())
and then calling the http method on it. So again, the route is basically the url, which in this case, is just that root url(for example) and
also the http method.

Now what do we actually want to happen when someone hits that url with that specified http method that we wrote for that route?
Whatever we wanna do, we need to specify it in a callback function as the second arg of app.<http method>() .

The req and res objects have a lot more data and methods on them in express than in normal nodejs. So you see that express apps and
so also node apps for that matter, are all about requests and responses, simply because, that is how the web works.
For sending the status code of response, before we send the data of response with res.send() , we just add status() before that.

For using nodemon, you need to use the file name with IT'S EXTENSION.

The ip for localhost is: 127.0.0.1 and then you can specify your port(first you need to start your local server though!).

The send() method, simply just sends a string back to the client, so if you wanna send json to the client, you need to use json()
instead of send() and in () of .json() , you just pass in an object.

The code of status() , will be shown in little bar up the response body section in postman.

When you get some HTML(!!!) as the response of request which in that html, it says: Cannot POST<the http method that you sent the request
with it> and the status code would be 404, that's what express automatically sends back and that's because we don't have ANY ROUTE defined
for that requested url and for that http method.

The default status code of a successful request is 200 and it's for when we don't specify any status codes for response in our code.

Important: By using the .json() method , that will AUTOMATICALLY set our Content-Type to application/json . Express also automatically
 sends a bunch of other headers as response headers. Like: X-Powered-By: Express , or the Date: ... , or the Connection: keep-alive.
But in nodefarm app, we did this manually. So back then, we also sent back some json, but we then had to MANUALLY define that the content
was json, so that the browser knew what it was EXPECTING. But express takes that work away from us when we use .json() method.  */

/* Our goal is that the exact same tours or ... that you see on the graphical interface (rendered website), must be get from the
API too.

An API is a service that we can request some data from it. Or in other words: API is a piece of software that can be used by
another piece of software in order to allow apps to talk to each other.
The application in API can actually mean many different things as long as the piece of software is relatively stand alone.
For example the node file system or HTTP modules. We can say that they are small pieces of software and we can use them (interact
with them) by using their API.So for example when we use readFile() function from the fs module, we're actually using the fs API!
So node APIs simply refers to the core node modules that we can interact with them. Or when we do DOM manipulation in the browser,
we are not really using the JS language itself, but rather, the DOM API that the browser exposes to us (or gives us access to it.)
Or another example: Let's say we created a class in any programming language, and then add some public methods or public properties
to it. These methods will be the API of each object that is created by that class, because we're giving other pieces of software,
the possibility of interacting with OUR initial piece of software (the object is our piece of software in this case.).So
API has a broader meaning than just web apis.
*/
/*
REST (representational states transfer) is basically a way of building web APIs in a logical way,making them easy to consume.
For building restful APIs in web, we must :
1)Separate API into logical resources. These resources should be exposed,which means to be available using structured and
resource-based URLs. What is a resource in APIs? It is an object or representation of something which has some data associated to it.
For example: tours or users or reviews. So basically any information that can be NAMED can be a resource. But REMEMBER: A resource
must be a name and not a verb.

 2) Expose structured and resource-based URLs. Means we need to expose (make available) the data by using some structured URLs that
 the client can send a request to those structured URLs. For example sth like : https://natours.com/addNewTour . In this example
 addNewTour is called an API endpoint. An API endpoint will send different data back to the client or also performs different actions.
 Another cases of API endpoints: /getTour, /updateTour. BUT : There is sth very wrong (bad) with these endpoints here.
 Because they really don't follow the third rule which says that we should only use the HTTP methods in order to perform actions
 on data.
 Important: So endpoints should only contain our resources and not the actions that can be performed on our resources. Because
  they would quickly become a nightmare to maintain.
 So how we should use these HTTP methods in practice? Or how these endpoint should actually look like?
 For example: /getTour endpoint is to get data about a tour(our resource). So we should name the endpoint /tours and send the data
 whenever a get request (get HTTP method from client) is made to this endpoint. So with this change, now we only have resources names in the
 endpoint or in the URL and no verbs, because the verb is now in the http method. Right?
 Good practice: Always use the resource name in plural.
 Now the convention is that when calling /tours endpoint, we get back all of our tours that are in a database. But if we only want
 the tour with one id (unique identifier- another example of the unique identifier is name of the tour), we add that id after
 another slash OR in a search query. Like /tours/7

* Learn: GET and POST and... are HTTP methods.
*
* If the client want to create a new resource in our database for example create a new tour-> we use POST and the url would be like:
* /tours but for POST HTTP method (POST requests can send data to the DB. In this case no id will be sent because the server should
* figure out the id for new resource.)
* Important: The endpoint name is exact for GET and POST for tours resource. The only difference is the HTTP method that is used for the
*  request.So if the /tours endpoint is accessed with GET, we send data to the client. But if the same endpoint is accessed with POST,
*  we expect data to come in with a request.So with this approach we use the difference between HTTP methods instead of using verbs in
*  endpoints.
*
* Learn: For updating a resource we use PUT or PATCH. The difference is that with PUT, the client is supposed to send the ENTIRE updated
*  object. But with PATCH, client supposed to send only the part of the object that has been changed. So with put http method, we expect
*  that our application receives the new updated object and with patch, we only expect the properties that should updated on the object.
*  So patch method is also easier for user to simply send the data that is changing, instead of having to send the entire new object.
*  So we are going to make our app to work with patch not put.
*  But both of them have the ability to
*  send data to the server, a bit like POST, actually with a different intent. Because POST is to create a new resource, while PUT or PATCH
*  are used to update an existing resource and also we have delete HTTP method. These are CRUD.
*  But there might be actions that are not CRUD and in that case we just need to be creative with our endpoints. For example, a login or
*  a search operation.These are not really related to a particular resource and they're not CRUD operations either. But still we can
*  create endpoints for them. Like /login or /search.
*
*  Learn: When we involve 2 resources at the same time together, it's not a problem with REST! So we can translate /getToursByUser to
*   /users/3/tours . So this particular endpoint can send data about all of the tours that user number 3 has booked.
*   Also for deleting a tour by a particular user we can set an endpoint like: /users/3/tours/9 on delete HTTP method.
*   So these examples were combinations of resources.
*
* 3) Use HTTP methods(verbs). Which means to perform different actions on data like reading, creating and ... , the API should use the
* right HTTP methods and not the URL.
*
* 4) Send data as JSON(usually). Means the data that we send back to the client or the data that we received from client, should usually
* use JSON data format.
*
* Remember: We could send our response to the client in JSON formatting, but usually we do some simple response formatting before
* sending.The one of standards is Jsend.In Jsend we simply create a new object, then add a status message to it in order to inform the
* client whether the request was success, fail or error and then we put our original data into a new object called data and wrapping
* the data into an additional object, like we did here is called enveloping and it's a common practice to mitigate some security issues
* and other problems.
* Other response-formatting standards: Jsend:API and Odata JSON protocol
*
* 5) Be stateless.
* In stateless restful API, all state is handled on the client and not on the server and state simply refers to a piece of data
* in the application that might change over time.For example, whether a certain user is logged in or on a page with a list of
* several pages, what the current page is?
* Now the fact that the state should be handled on the client means that each request must contain all the information that is
* necessary to process a certain request on the server.
*  So the server should never ever have to remember the previous request
* in order to process the current request. For example in a list with several pages, we currently are in page 5 and want to move
* forward to page 6. So:
* currentPage = 5;
*
* Bad practice for this example: We could have a simple endpoint called /tours/nextPage and submit a GET req to it.But then the server
* would have to figure out what is the current page and based on that send the next page to the client. In other word, the server would
* have to remember the previous request. So it would handle the request server side and this is exactly what we want to avoid in REST api.
* Plan: GET /tours/nextPage -> web server: nextPage = currentPage +1;
*                              send(nextPage); //The state is currentPage variable and it's on server side.So this is a bad practice!!!
*
* Bad practice for this example: Instead in this example we should create a /tours/page/<number of page> endpoint and pass the number
* 6 to it.This way, we would handle state on the client side, because on the client, we would already know that we are currently on
* page 5 and so all we have to do is to just add 1 and then request page number 6.So the server doesn't have to remember anything in
* this solution and all it has to do is to send back data for page number 6 as we requested.
* Plan: GET tours/page/6 -> web server : send(page 6)
*
*
*  */
/* request-response cycle: To start this cycle, our express app receives a request when someone hits our server and then it will
* create a req object and a res object. That data will then be used and processed in order to generate and send back a meaningful
* response. Now, in order to process that data in express, we use something called middleware. Middleware can manipulate the
* req or res objects or execute any other code that we like.So middleware doesn't always have to be just about the req or res object.
* But usually it is about request.For example express.json() is to access to the request body on the req object.Now it's called middleware
* because it's a function that is executed between or in the middle of receiving the request and sending the response.So we can say everything
* is basically a middleware.Even our route defenitions. Or express.json() which is also called body parser is a middleware. Or some
* logging functionality or setting some specific http headers.
* All the middleware together that we use in our app, is called the middleware stack.
* Important: The order of middleware in stack, is actually defined by the order they are actually defined in the code.So a middleware
*  that appears first in the code, is executed before another middleware that appears later.So the order of code matters a lot in express.
* Our request and response object that were created in the beginning, go through each middleware where they are processed or where
* just some other code is executed.Then at the end of each middleware function, the next() function is called, which is a function
* that we have access to in each middleware function (Just like req and res objects that we have access in each middleware).
* So when we call next(), the next middleware in the stack will be executed with same req and res objects and this happens until
* we reach the last middleware.
* You can think the whole process as kind of pipeline where our data goes through.
* The last middleware function is usually a route handler.So in this handler we actually not call the next() function to move to NEXT
* MIDDLEWARE(So we don't call next() to go to next MIDDLEWARE, but maybe we call next() to go to another route handler function! All right?)
* Instead, we finally send the response data back to the client.So with this, we finish the request-response cycle.
* So this cycle starts with the incoming request then executes all the middlewares in middleware stack step by step and finally send the
* response to finish the cycle.
* Learn: In order to use middlewares, we use app.use(). So use() method adds that middleware to the middleware stack.
*     */

/* You can branch off and create a new version of your API, while old users can still using the old one.But if we didn't use
different versions and changed the current api, the api would break for the users that were using it. So it's good to have
versioning. */
/* The second arg of .get() or .post() or ... (that callback function which has the req, res ,...) is called route handler.
Now in this case the tours is our resource. For sending back our data, we must first read the file of our data, but we must
do this reading out side of route handler and at the top-level code (top-level code is only executed once which is rightafter the
application starts.) */
/* When you want to send data, you must do it in Jsend format.So first we must add a status property code that can be either
success, fail or error in our json and then data property which is called envelope for our data, would be an object that contains
our actual data(the data that in response we want to send to client- But remember the format is key value pair,so we must use a
key name for the data that is in the data object, in this case the key name is also named tours.)
Learn: In ES6, we don't need to specify the key value pair if they have a same name.But here we should specify the tours key,
 because it's the name of the resource and also the name of the endpoint and this is why inside the data object we send back
 the tours property.*/
/* It's better to include another field (or another key value pair) called results when we would have multiple results in response
and in the results field we specify the number of results that we are sending back. (It's not a part of Jsend specification, but
we do this because this makes very easy to client to get the information that he is receiving very quickly.)
Recap: So we must send back the results field, whenever we are sending back an array (multiple JS objects), if we were sending
only one tour, we wouldn't do this.*/
/* The callback function after the url is called route handler. For better practice, we can export all of the handler functions and
create a new function out of them for each one. */

/* node.js or express apps can run in different environments and the most important ones are development environment and the
production environment. So depending on environment, we might use different db for example, or we might turn login on or off,
or debugging on or off or ... . So these factors are based on environment variables.By default, express sets the env to development.
Everything that is not related to express, we're gonna do it outside of app.js .So app.js is for configuring express application.
So env variables are outside of express.
Learn: You can see the environment that you are currently in by using: console.log(app.get('env')); so app.get('env') will give us
 the environment variable. This variable is set by express, but node itself has a lot of environments. So 'env' is set by express,
but node itself sets a lot of env variables and they're located at: process.env
and those env variables in node, are coming from process core module and there's no need to require process module. Sp it is
available everywhere.
Now in express, many packages depend on a special variable called NODE_ENV.It's a variable that's a kind of a convention, which
should define whether we're in development or in production mode.However, express doesn't define this variable, so we have to do that
manually.So we can use terminal. If you want to set an environment variable for a process like nodemon server.js , we need to
prepend that env variable to the process command. So we say: NODE_ENV=development nodemon server.js . Now if you start that process,
the NODE_ENV is set to development. Now you can create and set even more environment variables. So we can say:
NODE_ENV=development X=24 nodemon server.js .
Important: In windows for setting an env variable you must say: SET <name of env variable-like NODE_ENV> = <value>
 So for doing the prior task we can say: SET X=24 and hit enter, and then say: npm run start or nodemon server.js .Because
 windows can't run multiple commands at the same time without specifying anything. (In windows if you want to run multiple commands
 on a single enter, you must write & or && between them between each command.)
Learn: Many packages on npm that we use for express development, depend on this env variable and so when our project is ready and
 we're gonna deploy it, we should change the NODE_ENV env variable to deployment.
So environment variables are global variables that are used to define environment in which node app is running.
So whenever our app needs some configuration for stuff that might change based on the environment that the app is running on it,
we use env variables.For example, we might use different databases for development and for testing, so we could define one env
variable for each and then activate the right database according to the env. Also we can set sensitive data like passwords and ...
using env variables. Now it's not really good to define all of these variables in the command line, so we can create a configuration file.
So we create config.env .
Remember: The env variable names must be upper case (convention).
How connect the .env file with node app? So we need to read those variables and then save them as env variable. Because right now
that .env file is just a text file and node.js has no way of knowing these variables are in that file.
Solution: Use dotenv package from npm and then in server.js we require that package (Why in server? Because it has nothing to do with
express so we don't require it in app.js)
Learn: The below code, will read the env variables that are in .env file and save them in node.js environment variables (so they would be in
 process.env).
After this, we must use these variables in our code- like app.js file.*/

/* Mongodb:
* There is no need to define a document data schema before filling it with data. Meaning that each document can have a different number
* and type of fields and we can also change these fields all the time.
* Mongodb uses a data format similar to Json for data storage called BSON. Basically it looks the same to JSON, but it's typed.
* Meaning that all values will have a data type like boolean and ... .
* In mongo, we can multiple values for one field that are in an array.But in relational db, that's not allowed, so we can't have
* multiple values in one field(column).
* Also in mongodb we can have embedded documents.For example in one field, we could have an array of documents, which are like
* child documents for their parent field and that parent field is a child to the document. For example we can embed comment documents
* into the post document.
* So embedded or denormalizing means including related data into a single document. (But it's not the best solution always.
* But in relational databases, data is always normalized.So in these kind of dbs, it's not possible to embed data.So the solution is
* to create a whole new table and in this case that table is comments and then JOIN this table to posts table by referencing to the
* id field of comments table.)
*
* The maximum size of each document currently is 16MB.
* Each document contains a unique id, which acts as a primary keyof that document.That unique id is automatically generated with the
* object ID data type each time there's a new document.*/
/* After installing the mongodb app, you need to create a directory which mongo will store our data into that directory.
* So go to c drive, and there create a folder named data and in there create folder
* called db which in this db directory, mongol will store our databases.
* In bin directory we have mongod.exe file which is the server. So you must open this file using powershell to start the server.
* So we say .\mongod.exe in bin directory and then the server is running.(Remember before running the server you must create those
* folders in root of c drive.)
* Now the server would waiting for connections on port 27017. Now we need a shell to connect to server in order to be able to
* manipulate our databases (create database add document and ...). So open a new terminal and go to bin directory, Now you must run
* mono.exe file.Now you are connected to the same port. Now if you run db command, you would get the test database in result.
* So in one terminal we're running the server and in another terminal you're connected to server.
*
* Now what if you want to run the mongod.exe program from another directory?
* So for example from users directory? So if in users directory you type mongod.exe, it won't work. Because windows doesn't know
* where to look for mongod.exe file. So windows thinks this file should be in Parsa directory, but it isn't.
* So we need to find a way to tell windows to look for this file and find it in that bin directory
* Learn: so basically we want a way to run that file if we are not in the directory that file lives. So we must use SYSTEM VARIABLES.
*  So go to settings and search for env and go to 'edit system environment variables'. Now you are in system properties then click on
*  advanced tab and click on environment variables. Now look into system variables box and then on Path variable click edit,
*  now you can see there is a couple of paths added there. So if you add a path to a program, you can run that program anywhere
*  you want.Now add the path to bin directory of mongodb there.
*  Basically we add the absolute path to the folder where the program lives in that folder.
* Now after closing the old terminal and open a new one, if you run the mongod.exe server file from anywhere, it would run!
* Now you can run mongodb commands from anywhere on your system.  */
/* Let's create a database with mongo shell. So first you must run mongo server running in background (use mongod.exe to run server),
* and now we can type: mongo to open up mongo shell.
* For creating a database inside mongo shell, type: use <the name of database>
* Learn:Also you can use use command to go to an existing database (if that database already exists), but if that database
*  doesn't exist it would create the database with given name after use command.
* Now after creating database, it would create the database and then switch to it.Now you must create documents, but first you need
* to specify the collection before insert a document and also remember in mongo shell, db command stands for current database .
* So for inserting, say: db.<name of collection>.
* If the collection that you want to insert document in it, doesn't exist, it will first create it and then insert doc into it, using
* the prior command.
* Remember: We would have collections for each resources we have.
* Now pass a JS object into insertOne() function and it will then converted to JSON and BSON.
* You could use double quotes on property names, but it's optional.
* Important: If you want to use quotes in JS object that would converted to JSON, it's better to use double quotes and not single quotes.
*  But anyways, the single quotes will converted to double ones.
* Learn: Mongodb will create unique _id identifiers behind the scenes, when we insert a new document.
*
* The show dbs commands will show all the dbs that we have.
*
* So if you doesn't have a collection that you are inserting documents in it, it would create the collection and then insert those
* docs inside that collection.
*
* We have also the show collection command.
* quit() for qutting mongo shell.
* insertMany() will accept an array of multiple objects and each object is a document in the collection.For example:
* db.tours.insertMany([{...}, {...}, {...}])
*
* Learn: db.<name of collection>.find() will list all of the documents in the specified collection.*/
/* Mongodb documents are very flexible and they don't all have to have the same structure. So we can have different fields in
* different documents. */

/* Remember: For running mongo shell just type: mongo */
/* Queriying (reading) documents:
* EX) db.tours.find({ price: {$gt: 2000}, rating: {$lte: 3.2} })
* This example is an and query.
*
* EX) db.tours.find({ $or: [  {price: {$lt: 100}}, {rating: {$lte: 3.5}}  ] })
* So we start by $or mongo operator and this operator accepts an array of conditions, which each condition is an object.
* So in this example we have 2 conditions that for each document we search it's price and each rating and if ONE OF THEM (because
* we have $or operator) WAS TRUE based on condition, the doc will added to results.
*
* Besides the filter object (the object that has $or and our conditions ...), we can pass in the projection object. In projection object
* we specify what fields we want in the results output. So in that object we specify the name of the field that we want to be in the
* results and set it to 1 and other fields won't be in the results.
*
*  */
/* Updating docs: How updateMany() works? First we have to select which docs we want to update and second we pass in the data that should
* be updated.So the first arg is basically a filter object.
* In the second arg, we pass in an object and in that object we specify the $set operator which has a value of an object and in that
* object we specify the fields that we want to update and their values.
* Remember: If you were using updateOne() and the filter object result would return more than one doc, then ONLY THE FIRST DOC WOULD
* BE UPDATED, because you are using updateOne() instead of updateMany()
* If you update a field that doesn't currently exist in the documents that you want update, it will create those fields.
* So let's see an example that we're creating a new field with updateMany():
* EX) db.tours.updateMany({ $or: [ {price: {$gte: 500}}, {rating: {$gte: 4.6}} ] }, { $set: {premium: true} })
*
* With .updateOne() or .updateMany() we usually only update parts of a document or documents, but we can also completely replace
* the content of documents with .replaceOne() and .replaceMany() which like 2 prior functions, for first arg, gets the filter object (
* search query) and for second arg, gets the new data which is in an object for $set. */
/* Deleting documents:
* If you want to delete all of the docs inside a collection:
* db.<name of collection>.deleteMany({}) . Learn: Because an empty object is a condition that akk of the documents always match.
*
* Also for deleting, for first arg it takes the filter object... */
/* Important: In order to create a connection to local mongo database, you have to running mongo server running in the background.
*   You can start server by: mongod.exe */
/* Learn: project or projection means: In the result docs, just show some of the fields that I specified . */
/* In mongodb atlas, a cluster is an instance of our database. After building the cluster, we must connect our remote hosted database
* to our compass app in computer and also the mongo shell.
* After creating the admin of this project in mongodb atlas, you must save the password of that user (admin) in your .config file.
* So a db password is a great example for .config env file.
* After that we must choose a connection method and we will start by choosing mongodb compass application.
* So as you saw, the compass application is for interacting with atlas.Now it would give you a connection string. Past it in compass.
* Now our compass app is truelly connected to the online cluster and atlas.
*
* Now we must allow access from everywhere to our project's cluster. Because remember: In the beginning, we whitelisted our IP address
* in order to grant access for our current computer to current to the project's cluster. But if you switch to other computers during
* development or ... you might need to whitelist the IP of those computers too. But here we can whitelist any other IP in the world and
* allow access from anywhere.But you still need your username and password. So go to Network Access> ... . Now the IP whitelist should be
* 0.0.0.0/0 .
*
* Now let's connect our mongo shell to this cluster. So go to clusters>connect>connect with mongo shell. Now open up the mongo server in
* terminal and in another terminal, past the string from atlas. Now if your run: dbs, it will show the databases in that specified db
* in connection string. Now in that tab of terminal you are connected to that database in atlas.
* Now both compass and mongo shell are connected to our remote hosted database (atlas).
*  */
/* For connecting the atlas cluster to our app, we must store the connection string in the .config file.
* Remember: When your're using local database instead of atlas, never close mongod.exe terminal. */

/* Now we need to install the mongodb driver. It's a software that allows our node.js code to access and interact with a mongodb
* database and there are a couple of mongodb drivers, but we use mongoose which adds a couple of features to native mongodb drier.
* In other words, we use mongoose to connect our code to mongodb.
* So write: npm i mongoose
* Mongoose is an object data modeling (ODM) library for mongodb and nodejs which provides a high level of abstraction. So
* mongoose is a layer of abstraction over mongodb driver.
* Object data modeling library is just a way for us to write JS code that will then interact with a database.So we could just use
* a regular mongodb driver to access our DB, but we use mongoose because it's gives us a lot more functionality out of the box.
* So mongoose allows us faster and simpler development of our apps.
* So mongoose allows for rapid and simple development of mongodb database interactions.
*
* Some features that mongoose gives us: It gives us schemas to model our data and relationship, easy data validation, a simple
* query API, middleware and ...
* In mongoose a schema is where we model our data. So where we describe the structure of data, default values and validation.
* Then we take that schema and create a model out of it and a model is basically a wrapper around the schema, which allows us to
* actually interface with the database in order to create, read ... docs.
* Schema -> Model
* */
/* Important: We configure mongodb in the server.js file not app.js . First require mongoose there. */
/* Mongoose is all about models and a model is like a blueprint that we use to create documents and also to query, update and delete
Learn: these docs. So basically to perform each of CRUD operations, we need a mongoose model and in order to create a model, we need a
 schema. So we create mongoose model out of schema and also we use schema to describe our data, to set default values, to validate
 the data.
Mongoose uses native JS data types.*/

/* Remember: For using async await, you must create a function. Right? Because async is usually used in declaring function itself. */
/* Model layer  is concerned about the data and the business logic. In controller layer, handles application's request, interact with
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

/* Mongodb aggregation pipeline: The idea is basically we define a pipeline, that all docs from a certain collection, go through
that pipeline, where in that pipeline, they are processed step by step in order to transform them into aggregated results.
For example we can use aggregation pipeline in order to calculate averages or min or max value of multiple fields and ...
* */

/* Just like express, mongoose also has the concept of middleware and first type of them in mongoose called document middleware.
* So we can use mongoose middlewares to make something happen between two events. For example each time a new document is saved to
* the db, we can run a function between the save command is issued and actual saving of the doc or also AFTER saving the doc and that's
* why a mongoose middleware is also called pre and post hooks.So again because we can define functions to run BEFORE or AFTER a certain
* event, like saving a data to db.
* There are 4 types of middlewares in mongoose: document, query, aggregate and model.
* Learn: Document middleware can act on the currently processed document. So just like virtual properties we define a middleware on a
*  schema and in our model file.
*  */

/* NDB (node debugger): Is a npm package.So npm i ndb --global (you should install it as a global package). But if you want to
* install it locally, you can install it as a dev dependency.
* After installation add a new script in package.json and that script would be sth like: "ndb <entry point file>" and this is gonna work
* no matter if you installed ndb locally or globally. Now you can run this script instead of nodemon, because ndb will start the server
* as well and it would try to do this in the same port of nodemon command so it's not gonna work. So we need to finish the command that
* is currently running and then run debug script.
*
* You notice that in app variable which is the express application variable, we have a function(method) called _router and it has a
* property called stack. Which is the middleware stack that we have in our application.
*
* In ndb we can set a breakpoint on one of our route handler functions and then send the request to the route that this function is
* responsible for it and see the variables in it.
* So we find out that when we set a breakpoint on a line of code, our code will stop running at that line where we defined a breakpoint.
* In other words our code will froze or stuck at that point. So if a user just sends a request to api, if that line must be executed
* in order to send a response to the user, it won't and simply the user won't get any response and request-response cycle will stuck
* at that line. Now if you want to resume the execution of code after that breakpoint, you can use F8 (run script execution) button.
* Which will continue the execution of code until next breakpoint(if there isn't any breakpoint after this breakpoint, it will run
* the code till end.)
*
* Learn: Remember that when you set a breakpoint earlier in the code , if you for example send a request to where the code that has a
*  breakpoint must run, the response won't back until you remove that breakpoint. Because we basically stop the execution of further code in
*  breakpoints. Right?
*
* In ndb, the step tool will execute the next line of code after breakpoint. For example if our breakpoint was on this line:
* ...
* .limitFields()
* ...
*
* If we use step, the next line is the code that is inside the limitFields() method. So with using step tool on this breakpoint, we will
* go to the first line of that method (the lines that this method has defined)*/
/* We need to handle our errors in a central place in our app. What we did up until this point, was to simply send back an error
message as JSON in each route handler in case something went wrong.

Two types of errors that can occur:
Operational errors are problems that we can predict that they will inevitably happen at some point in future, so we need to
handle them in advance. and programming errors. These types of errors have nothing to do with bugs in our code. Instead they
depend on user or the system or the network. For example:
user accessing an invalid route
invalid inputted data from user(validator error from mongoose)
failed to connect to server
failed to connect to database
request timeout and ...

We need to handle these errors in order to prepare our application for these cases.

 Programming errors: like:
 Reading properties on undefined
 Passing a number where an object is expected
 using await without async
 using req.query instead of req.body and ...

 When we're talking about error handling with express, we mainly just mean operational errors. Because these are the ones that are
 easy to catch and handle with our express app and express actually comes with error handling out of the box. So all we have to do
 is to write a global express error handling middleware middleware which will then catch errors that are coming from all over the
 application. So no matter if it's an error that is coming from a route handler function or a model validator or ... , the goal is
 to that all of these errors end up in one central error handling middleware. So with this, we can send a nice response back to
 the client and letting them know what happened.
 The beauty of having a global error handling middleware is that it allows us for a nice separation of concerns. So we don't have to
 worry about error handling in our business logic or in our controllers or really anywhere else in our app. Instead we can simply
 send the errors down to the error handler which will then decide what to do with those errors.
  */
/* A better way of catching errors in async functions:
* Right now, in all of our async functions, we have try {}catch() {} blocks. Because that is how we usually catch errors in
* async functions by using a try catch block. But that makes our code messy. So for example, the goal of a function like createTour is
* to just execute a code that creates a tour and not mess around with error handling. But we are using try catch blocks which are
* for error handling and this is not good. Also we have a lot of duplicate code because in each of our handlers, we have quite a
* similar catch block. So in all of those blocks, all we're doing is to send an error or fail response and that response would actually
* not even be sent here and it would be sent from our global error handling middleware. So we need 2 things to fix.
* But first let's fix those try catch blocks in our async functions because they aren't ideal. The solution is to take out try catch
* block, out of the async functions and put them on a higher level in another function. So basically what we're gonna do is to
* create a function and then wrap the async functions which are using try catch blocks into that newly created function and that function
* is catchAsync .We called it like this, because the goal of this function is to simply catch our async errors and inside this function
* we will pass in a function.
* After creating catchAsync function, we will wrap all of the definitions of the functions that we want to pass in to this catchAsync
* function. Because well, as I said we must pass in a function to catchAsync function.
*
* Question: When we're calling fn() in the catchAsync() function, how we call the incoming function (fn) by passing it req, res and next?
* Why we actually have access to req, res and next inside catchAsync() ? Right now, we haven't req,res and next inside catchAsync() function
* But we will fix that.
*
* Important: Right now if any of your middlewares in tourController or userController doesn't have the next parameter. Pass it to them.
*  Because we need to call next(), in order to pass the error into () of next() and therefore go to our global error handler middleware
*  by calling that next(error) with error inside it's parentheses.
*
* Now, as you can see we're passing an async function to fn() function and we're calling that async function inside of catchAsync() .
* But as you know, when we want to call an async function, we must await for it. Right? We can't just simply call the async function like
* asyncFunction() . We must use .then() and await for it.
*
* After using .catch() on calling the incoming function, we can remove try catch blocks and just hold the code that is inisde
* try block. Because again, the code that is inside catch blocks, transferred to fn(...).catch(...) in the catchAsync() function.
* In catchAsync() function, it's easier to use .catch() on returned promise of fn(...) than using catch(err) {...} block.
* In other words, we transformed catch block into a .catch() method on returned promise.
*
* Now there are actually two big problems: First is that fn(req, res, next) has no way of knowing req and res and next. So right now
* the incoming function or fn don't know what is req, res and next. Because we did not pass them into catchAsync function therefore
* there's really no way for catchAsync function to know these variables and their values.
* The second problem is when we are calling catchAsync with parentheses, inside of catchAsync function itself, we are RIGHT AWAY
* that incoming function and that's not how it is supposed to work. So createTour() function should be really a function but not
* the result of calling another function. (As you can see the createTour function is result of calling catchAsync(createTour function definition)
* ) . So the createTour() function shouldn't be called and instead it should sit and wait until express calls it and we know that
* express will call this function as soon as someone hit the route that needs this createTour function to be executed.
* Again in other words, we are calling createTour() function manually by calling it by another function which is catchAsync() and pass
* createTour function into catchAsync() which this catchAsync() function would call createTour() (basically catchAsync function would
* call any function that we pass that function to it and in this case that function we pass to catchAsync is createTour and therefore
* createTour would be called manually by us and that's not good because we want to express itself called createTour function not us!)
* and this isn't good.
* The solution is to make catchAsync() function return another function which would be assigned to createTour and that returned function from
* catchAsync, can then later be called WHEN IT'S NECESSARY BY EXPRESS. In other words that returned function from catchAsync
* is gonna be the function that express would call when necessary. So in catchAsync let's say:
* return (req, res, next) => {
* TODO ???????? I don't understand
* }
*
* Also we can simplify err=> next(err) with next. So it would be :
* return (req, res, next) => {
* fn(req, res, next)
          .catch(next);
* }
*
* Recap: In order to get rid of try catch blocks in createTour function, we wrapped createTour async function inside of catchAsync() function
* that we just created.The catchAsync() function will then return a new anonymous function and this anonymous function will be
* assigned to createTour function and this new anonymous function will then called as soon as the new tour should be created
* using the createTour handler function and that's why this new anonymous function has the exact signature as createTour function.
* Signature means: (req, res, next) . Now what this new anonymous function will then do is that it will call the function that
* we passed to catchAsync() (in our case that function we passed was createTour) and then it will execute all the code of that
* passed in function and since the passed in function is an async function, it will return a promise and therefore there's an error
* in that returned promise, or in other words, in case that promise gets rejected, we can catch that error using the catch method which is
* available on all of the promises and in the end, that is the catch() method which will pass the error of createTour function into the next
* function, which that error will end up in our global error handling middleware.
*
* The reason of creating the catchAsync function is to catch all of the errors of our handler functions in one place and not catch
* the error of each function in itself and therefore have bunch of catch blocks which all of them are doing kind of same work which is
* to get the operational errors of that handler. So we transfer all of these catch snippets into one function which is called catchAsync.
* Now why we must pass in the entire function to catchAsync function? Because ??TODO
*
* So now if we create a new tour and then some errors happen, then that error should catched in the catch method inside of catchAsync()
* function and the error will sent to our global error handling middleware and that middleware will send back the response.
*
* Now if we try to create a new tour with some errors, for example don't send all of the required fields for creating a tour,
* we will get back a 500 internal server error for statusCode because the error that just sent to the error handler middleware, didn't
* have any statusCode property. So we must fix that.
* Now let's export the catchAsync function into it's own file.
*
* We could wrap the route handler functions inside catchAsync(), right in the route files instead of wrapping them in controller
* files and that would have the same result. For example:
* router.route('/tour-stats').get(catchAsync(tourController.getTourStats));
* but we didn't do it this way, because if we use this approach, we have to remember which of these functions are async functions.
* Because remember we use catchAsync() function on async functions, right?
*
* Npw we want to implement 404 error. Because for example when someone enters a wierd ObjectId like ddff in url for getting a tour,
* of course he would get an error that says: cast to ObjectId failed. But when someone enters a valid ObjectId but that ObjectId doesn't
* exist in our database, the result of our api would be:"tour": null . which is not good.We want it to show a 404 error message. So we must
* add some stuff to getTour handler function. It would be: if(!tour) {...}
* */
/* Important: We created appError class in order to create the errors with that custom class. Which that class has some properties
*   which are very custom like isOperational property. So we created this class because for example isOperational property doesn't
*   exist in Error built-in class. So this class is some kind of error constructor for us that we can produce our own errors with the
*   help pf that class.
*   But we created an anonymous function in catchAsync file to actually have a common catch error place for all of our handler functions
*   instead of writing one catch block for each handler function, we simply create a function that do this catching error responsibility
*   which it's job is first execute the route handler function then catch the error(if there is an error!) and then send that error
*   to our global error handler middleware by calling next(err) .
*   Remember: These route handler functions would called based on the route that the user requested.
*
* Remember: You MUST give each of the route handlers that are giving them to catchAsync function, next arg. Because it's true that
* maybe we don't use next arg inside the function itself but in catchAsync function we definitly need to call next(err) if there's an
* error, so we must pass next to all of the route handler functions. */
/* We need to send different error messages for development and production environments. The idea is that in production we want to
* leak as little information about our errors to the client as possible. So in production, we only want to send like a nice human-friendly
* message so that the user knows what's wrong. But on the other hand, when we're in development, we want to get as much information
* about the error that occurred as possible and we want that information right in the error message which is coming back. Also
* we could log the information to the console, but I think it's way more useful to have that information right in postman.
* For distinguishing between development and production modes for executing some code we say:
* if (process.env.NODE_ENV === 'development') {
*   ...
* }
*
* So in errorController.js , we check if we are in development mode, we send back some more detailed error response but if
* we are in production, we would send a simpler error or fail response to the client(if we have an error of course!).
* Important: So it's important to send one type of response error to client in development mode and another simpler type of response error or
*  fail error in production mode and we do that in errorController file.
*
* Now let's create some functions for sending errors in that file. In those functions we need to args to pass to them. One is
* the error itself and the second one is response. Why we need to pass response? Because for SENDING a response to the client we need
* the res object that was provided by express. In other words all of the .status() and .json() methods that we want to send the
* response, is actually available only on res object. So we need it in order to send the response.
*
* In AppError class we mark all of the errors that WE create using AppError class, by giving those custom errors a property called
* isOperational and set it to true. So all the errors that WE CREATE OURSELVES, would be operational errors and in fact, it's only these
* operational errors that we want to send their err messages to the client, at least in production. On the other hand, when we have
* a programming error or some other unknown error that comes from a third party package, we don't want to send any err message about
* those kind of errors to the client in production. So this is why we created isOperational property, in the errorController file.
* Important: When we're in PRODUCTION MODE, in situations we have error in programming or error in packages or ... ,
*  (the errors that are not operational errors), we don't to send messages about the error and we just want to send a very generic
*  error message to the client. So we use if(isOperational) when we want to send error responses in production mode. But for errors
*  that aren't operational in production, for ourselves, we want to know an unexpected error happened, so we just log it to the console.
*  But when we're in development mode, we want to have as much details about the error that just happened as possible in order to get
*  rid of that error. It might be an programming error, so with those details we can get rid of bugs.
*
* There are real logging libraries on npm that we could use instead of simple console.error() , but this special log, will make
* the error in console very visible.
*
* Right now there are some errors, that maybe come from mongoose which we didn't mark as operational errors by setting isOperational
* property on them. So they would have a response of: something went wrong! Because they aren't operational. So we didn't create
* those errors by ourselves. BUT WE NEED TO MARK THEM AS OPERATIONAL ERRORS TOO, so by setting them to operational we can send an
* appropriate error message for those kind of errors. Actually there are 2 or 3 other errors that we need to mark.
*        */
/* Remember: We can execute some code even after sending back the response to the client (we can't send 2 responses for one
request, obviously!), but if you want to say: I don't want to execute further code in a function, say: return; */
/* There are 3 types of errors that might be created by mongoose and we need to mark them as operational errors. So by mark them as
* operational errors, we can then send back meaningful error messages instead of generic error message. Because when we're in
* production mode, if the error haven't isOperational property, we would send a generic error message for it.
* Now let's simulate those 3 errors. First one is when we try an invalid _id in getTour . Because this error is very common, so we
* need to mark it as an operational error and send back a meaningful response instead of mongoose default response. So the goal is to
* mark this error as an operational error and create a meaningful message.
* The second common error is when the user is trying to create a tour and he send a duplicate name for the tour he wants to create.
* So this error is very common and right now it hasn't a very meaningful error message. So we want to customize this error.
* The third common error is when user wants to update a tour and he wants to update a tour with ratingsAverage of 6! But the maximum
* ratingsAverage is 5. We mark these errors as operational IN PRODUCTION. Because in development it doesn't matter the error is an
* unexpected error or an error that is common and we customized it. Because we want to get as much information about the error as
* possible.
*
* Learn: For returning a meaningful error message for mongoose common errors, we can check the error.name property to figure out what is the
*  kind of error and if it was a common mongoose error, we behave it like an operational error.
*
* For converting a mongoose default error to our customized errors we call handleCastErrorDB() function to convert that kind of error
* to our special errors that are created with AppError class and those errors would be marked as operational. Because remember, all of our
* errors that created by AppError class, have isOperational property set to true. So handleCastErrorDB() would return that special error
* so let's save the result of it to a variable(err).
* Important: It's not a good practice to override the arguments of a function. In this case we are overriding the err argument.
*  So instead of overriding err object, we can create a hard copy of that err object and we will use let and not const because we will
*  reassign a new err later. For creating a hard copy of an object(in this case that object we want to create a hard copy from it is
*  err object), first we must destructure that object we want to create a hard copy from it.
* After destructuring err object, we use error object in furthur code.
*
*
* Learn: In express, normal names of errors are err.
* Learn: The errors that are coming from mongoose, (they aren't customized currently!) have a property called path, which is the
*  name of the field for which the inputted data is wrong. In other words, path field shows the field that had a wrong value in
*  inputted data and that WRONG value for that field which has the wrong value is in value property.
*  For example if the user requests a tour with wwww _id, the path property in err object would be _id and the value property in
*  err object would be wwww.
*
* Now let's handle the error that occurs when we try to create duplicate fields for fields that are supposed to have unique values.
*
* IMPORTANT: If you see that process.env.NODE_ENV is not equal to development or a string, it's probably it has some spaces.
*  So look at your package.json (where you SET the NODE_ENV environment variable) , you must use:
*  SET NODE_ENV=production&& nodemon server.js instead of "SET NODE_ENV=production && nodemon server.js"
*  Because if you use the second one, the value of process.env.NODE_ENV becomes production + " " instead of production and the
*  comparison of if (process.env.NODE_ENV === 'production') always returns false. But if you use the first one npm script,
*  that comparison returns true. Also it's a good practice to use process.env.NODE_ENV.trim() when you want to do comparisons between
*  process.env.NODE_ENV and production or development or ....*/
/* Now let's handle the error that occurs when we try to create duplicate fields for fields that they are supposed to be unique.
*  For example we try to create a tour with a name which that name exists. Currently the error that comes from this situation
* doesn't have the name property and that's because it's actually not an ERROR that is caused by mongoose and it's caused by
* underlying mongodb driver and what's we're gonna do to identify this error is to check the code property which would be 11000
* in case of duplicated field which must be unique(because in this case we don't have the name property).
* So now, let's create a function for the case that we want to check the error.code property and that function is named
* handleDuplicateFieldsDB() . Also I added DB in the end of name of the function to know that this function is taking care of
* stuff about database(in this case duplicated field which must be unique).
*
* For getting the field that was duplicated and it's value we must use a regular express to extract the value of that
* duplicated field which the user sent to us, from the message property of the error. The non operational error message property that is
* coming from mongoose is something like:
* "message": "E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: \"<THE VALUE OF DUPLICATED FIELD\" }",
* For finding the duplicated field and it's value, the instructor uses:
* const value = err.message.match(/(["'])(\\?.)*?\1/);
* Now we want the first element of the result of the match() method. So :
* const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
* But in my error object there isn't any message or errmsg property. Instead I have keyValue property which has an object of
* duplicated field-value in request.
*  */
/* Now let's handle mongoose's validation errors and make them customized.
* For example you want to update a tour with a difficulty of insane and the validator doesn't let this.
* So enum is a validator. Or send a field that it's value is very short.
* When some validators throw errors, in response we would have a property named error and in that error we have an object called
* errors and in that errors object, for every field that it's validator threw an error, we have the name of that field and the
* values for the name of each field that it's validator threw an error are some properties which we interested in properties property,
* which it's value is an object that have message property and path property which is the name of the field and ... .
* Message property is the message that we defined in the mongoose schema. Remember: We find out all of these objects in development
* mode and you can't see any of these objects in production mode, because in production mode we want to send that concatenated string
* which has all of those messages put together.
* Our goal is to extract the message properties from properties object which is in an object that it's name is the name of
* each field and all of them are in errors object and put all of those messages in one string.
* Solution: We need to loop over all of the objects and then extract all of the error messages into a new array.
* Learn: In js, we use Object.values() in order to loop over the elements of an object.
*
* In our code, errors variable would be an array of all of the error messages.
* When we say: Object.values(err.errors) it would return an array of objects that each object's name is the field name which have validator errors.
* If in the requested fields there were errors in difficulty field and name field, the result of Object.values(err.errors) ,
* would be an array of difficulty object and name object.
*
* Learn: The ValidationError s are created by mongoose. Just like the CastErrors, so they look similar.
*
* So: 
* Now if you found another error that you want to mark it as operational error, you just need to use an if statement to catch those
* types of errors and in that if statement, you need to call a special function which make those kind of errors operational by
* returning a new instance of AppError() class and also create a message for those kind of errors and pass it to new AppError() and
* a status code must also pass in to return new AppError() and then sendErrorProd() will send that error to the client.
*
* Still it would be some errors that are completely out of mongo or express and we need to prepare for them.*/
/* At this point, we successfully handle errors in our express application by passing operational async errors down into a global
* error handling middleware. That middleware then sends relevant relevant error messages back to the client depending on type of
* error that occurd. However, there might also occur errors outside of express and a good example for that kind of errors in our
* current application is the mongodb database connection. So imagine the database is down for some reason or for some reason we can't
* log in and in theses cases there are errors that we need to handle as well. But they didn't occur INSIDE of the express application
* so the global error handler that we implemented won't catch these errors. For test, let's change our mongodb password in .env
* file. Because that way, we're not gonna able to connect to db. Now save it and you would get an error, in server.js file and you would
* get: unhandled promise rejection.
* An unhandled promise rejection, means that somewhere in our code, there is a promise that get rejected.But that rejection has not
* been handled anywhere. Also in error, you would see a deprecation warning. Which says in the future, unhandled rejections will
* simply exit the node program that's running, which may not always what you want.
* Now all we have to do is when we are using mongoose.connect() and after using .then() on it, use .catch() . Now with that .catch()
* you would no longer get unhandled promise rejection when you couldn't connect to database.
*
* Now how we can GLOBALLY handle the unhandled promise rejection errors (because in bigger apps, it can become a bit more difficult
* to always keep track of all the promises that might become rejected at some point)?
* So let's delete that .catch() in mongoose method and we're gonna do it globally. We're gonna handle them globally in server.js
* and we're gonna use event listeners. So each time that there is an unhandled error rejection somewhere in our app, the process object
* will emit an object called unhandledRejection and so we can subscribe to that event by using process.on(...) .
*
* Remember: err.name and err.message are kind of default properties that we have on err objects in node. */
/* Now we must catch uncaught exceptions. But what are they? Well, all errors or let's call them bugs, that occurs in sync code but are
* not handled anywhere are called uncaught exceptions. For example console.log(x) which x is not defined. For handling them we listen
* to uncaughtException event.
*
* In unhandledRejection, make the app to crash is optional by using process.exit(1) , but in uncaughtException we really need to
* crash our app. Because after there was an uncaught exception, the entire node process is in a unclean state and for fix that,
* the process need to terminated and then restarted and again in production we should have a tool in place whcih will restart the
* application after crashing.
* In node.js this isn't a good practice to just rely on these 2 error handlers. So ideally errors should really be handled
* right where they occur. For example in connecting to database error, we should add a catch handler to mongoose.connect() and not
* just simply rely on the unhandledRejection callback
*
* Important: 'uncaughtException' event listener must be at very top of our code, or at least before any other code is really
*  executed. Because if we would have an error before this handler, it won't catch that error.
*  Also the 'uncaughtException' handler must be in the entry file which is defined in package.json file. Because that's the file
*  that our application starts to running.
*
* Now if you put that 'uncaughtException' handler a the very top, for example after requiring dotenv package,  the server is not defined
* at that point. But that's not a problem, because actually we don't need server the server there and that's because those
* 'uncaughtException' errors, won't happen asyncronously. So they haven't to do anything with the server actually. So I comment
* some parts of it.
* Now we have that 'uncaughtException' error handler for sync codes, before we actually require our main application. So because
* it is before the requiring of main application, it can catch all of the 'uncaughtException' errors in our APP. So if we would
* have an 'uncaughtException' error in one of our middlewares, if that middleware doesn't execute, that 'uncaughtException' error wouldn't
* be catched by 'uncaughtException' error handler. For example if we have console.log(x) in one of the middlewares that runs when
* we have an error, that 'uncaughtException' error won't catched by 'uncaughtException' error handler.
* Why is that? Because a middleware would execute if we have a request.
*
* Learn: At this point if you have something like console.log(x) in one of your middlewares that run for the request, in production
*  mode we would get 'something went wrong!' message in the response. Because that console.log(x) is non operational error(an error
*  that we didn't create ourselves).
*  Also if the non operational error happen outside of middlewares in production mode, the 'uncaughtException' error handler would catch it.
*  So when there is an error in express or any middleware, it would go automatically to global error handling middleware which is
*  in errorController file. Also if we were in development mode and have non operational error, the response would be the detailed
*  error. Why? Because again we have an error in one of our middlewares which is a part of express application and express will
*  automatically send that error to global error handling middleware and ... .
*  But if we are in development mode and there is a non operational error outside of middlewares, that error would catched by the
*  'uncaughtException' error handler. */

/* Authentication, authorization and security section:
Authentication and authorization is all about users signing up and logging into our app and then allowing them to access certain
parts of app that are not accessible to non-logged in users.
For authentication we use JWT.*/
/* Authentication and authorization are all about users signing up, logging in and accessing pages our routes that we grant them
permission to do so. So it's really all about the users.
When we set a field with required: true the request must contain that field with it's value.
We didn't use a username property for user to login, because he will use it's email instead of username for login.
The email field is a unique identifier of each user so it must be unique for each user.
Learn: By default emails should be unique. But we 10% sure with this. by using unique: true in email field so there will be no accounts
 with the same email.

 Remember: lowercase is not a validator. All it's do is to transform the value of that field to lowercase.
 Photo field is usually optional in most web applications.
 Learn: If a user wants to upload a photo, that photo will be stored in our filesystem and the path to that photo will then be stored
  in the photo field in database. Like imageCover in tourModel file.

Usually the most secure passwords are the longest ones and not the ones with some symbols or crazy characters. So longer password
would be more effective than some symbols.

* Later we must also use a validator to see if the confirmPassword field is the same as password.
*
* Model variables are usually start with capital letter.*/
/* We will do most of the user-related stuff like creating new users, logging users in or updating passwords in the authentication
* controller. So all of the stuff that are related to authentication are not gonna be in userController file that we created before, but
* instead we will create an authentication controller file.
* In authController.js , for creating a user, we don't name the function that do the creating user, createUser like what we kinda did in
* tourController file but instead we named it signup. Because that's the name that has a bit more meaning in the context of authentication
* and that would be an async function because we would have some db operations in that function.
*
* How we create a new doc based on the model? We use: const <a variable> = await <model name>.create(<an object of data which the user
* should be created from that data>);
* <model>.create() would return a promise so we must use await on that.
*
* In the JSON that we send back to the client, the data property which it's value is an object is called envelope.
* When we have an async function, we REALLY need to think about it's error handling. So we use try catch blocks or we use catchAsync
* function that we created before.
*
* The user resource is a bit difference from all of the other resources. Because it really has to do with all things authentication and
* so we have a different controller for authentication itself so we also have a special route for authentication.
* Recap: We know that authentication would be used for users resource but it has a separate route from users resource and also separate
* functions for handling authentication for users resource and therefore we won't write authentication code in users route handler functions
* and we will separate the code for authentication into it's different route handler functions.
*
* So we have to use router.get(). ... inside the userRoutes file, but that router is for authentication although it's in
* userRoutes file.
* Also as you can see, currently we didn't use router.route(). ...  for authentication routes. Because we don't have other routes, so
* with route() we could briefing the route path for all routes. Currently we don't use that.
*
* So as you can see, this '/signup' endpoint is really kind of special endpoint. Because it doesn't fit the REST architecure.
* Because as we said, in special cases, we can create other endpoints which do not fit 100% with the REST philosophy. Because as you can
* see the name of the url('/signup') is related to the action that would be performed. So it's not based on REST philosophy.
* But in the tours routes, the name of the url has nothing to do with the action that user wants to do. So for example '/' has nothing
* to do with getAllTours or createTour. But in routes for users, '/signup' is related to the action that user wants to do which is
* signing up in our application.
* Also for tour routes we use different HTTP methods for a common route like '/' but in users routes we only need POST for the
* '/signup' route and we can't and shouldn't use other HTTP methods for this route. Because it doesn't make sense to have PATCH
* request for a url called '/signup'. Because the meaning of sign up is register and for register we use post http method and not get
* or patch because the user must create a document and also send some data so we must use only post.
*
* In addition to '/signup' and other future routes for non restful routes in users routes, we will keep the routes that were
* implemented based on REST philosophy.Like .route('/').get(userController.getAllUsers) and other old rest based routes and their
* handlers. Because there's also some possibility that the system administrator would want to update or delete or create a users
* based on their id. So because he is admin and doesn't need authentication, we keep these routes which haven't authorization.
* So it's not the admin who would signup the user or login the user. It's the user itself who would signup and ... .
*
* In database we shouldn't see the plain passwords of our users. Even if we're the admin.
* Learn: In web applications, passwords should never ever be stored as plain in the db.
*  */
/* First we need to validate if the inputted password is equal to the confirmed password and we do it in confirmPassword object in
 the users schema and also we need to encrypt the password in db.
 The callback function that we specify in validate object in confirmPassword field would be called when the new document is gonna
 be created.

Validator package also checks for domain names, so a domain with just one word like: i, o or ... are not acceptable.

For implementing encryption, we do it in model files and not controller files. Because in encryption we are really working with
data itself.
For doing encryption for passwords, we can use mongoose middleware . For encryption we would use pre-save (pre-hook save) middleware.
So basically document middleware.
Learn: Why we used .pre() middleware? Because in .pre() , the action would be performed between the moment that we receive the data and
 and the moment that the data is persisted to the database. That moment is when the .pre middlewares would executed. So between getting
 the data and saving it to the database. So that moment is the perfect moment to manipulate the data, like encrypt the password and ...

 With the next arg in function of .pre() we can call the next mongoose middleware.

 bcrypt algorithm will first salt and then hash our password in order to make it really strong to protect it from bruteforce attacks.
 Because bruteforce attacks could try to GUESS a certain password, if that password isn't very strong encrypted.
 Bvrypt will salt our passwords means that bcrypt will add a random string to the password, so that two equal passwords do not generate
 the same hash.

 bcryptjs is a bcrypt implementation for javascript. But when you want to require this package you must use bcryptjs and not bcrypt.
 So: npm i bcryptjs .

 The second parameter of .hash() us cost parameter and we could do this in two ways. The first way is to manually generating the salt,
 (salt is a random string that would be added to our password or any field) and then use that salt in the hash function.
 But instead to make it easier, we can also pass a cost parameter to hash() function. The cost parameter is basically a measure of how
 CPU intensive this operation would be. The default value for it is 10. More cost para, the better encrypted password.
 hash() function is an asyncrounos function, but there also a sync version.
 Important: But we don't want to use sync version because that would block the event loop and then prevent other users from using the
  application. So because it's async function, it would return a promise.

 Even if two users use exact same passwords, their encrypted passwords which are in db are very different and that's the power of
 salting the values (in this case passwords) before hashing them.
 */
/* There are many authentication methods. Json web tokens are a stateless solution for authentication. So there is no need to
* store any session state on the server, which of course is perfect for restful APIs. Because remember, restful APIs should always be
* stateless.
* The most widely used alternative to authentication with JWTs is to just store the user's login state on the server using sessions.
* But that not follows the principle that says restful APIs should be stateless.
*
* Let's assume that we already have a registered user in the db. Then the user starts by making a post request with the username or
* email and the password in body of request. Then the application checks if the user EXISTS and if the password is correct and if so,
* a unique web token for ONLY that user is created using a secret string that is stored on the server and the JWT itself, is really just
* a string. Then the server sends that JWT back to the client which then will store it either in a cookie or in a local storage
* and the user is authenticated and basically logged into our app WITHOUT LEAVING ANY STATE ON THE SERVER.
* So in fact the server doesn't know which users are actually logged in. But of course the user knows that he's logged in because
* he has a valid json web token which a JWT is a bit like a passport to access protected parts of the applications.
* Recap: A user is logged in as soon as he get back his unique valid json web token which is not saved anywhere on the server.
* Therefore that process is completely stateless. Then each time the user wants to access a protected route, like his user profile,
* he sends his json web token along with the request. So it's like showing his passport to get access to that route.
* Once the request hits the server, our app will verify if the json web token is actually valid. Now if the token is valid,
* then the requested data will be sent to the client and if not, then there will be an error that tells the user that he's not
* allowed to access that resource or route and as long as the user is logged in, this process is how it's gonna work each time that
* he requests data from any protected route.
* All of this communication must happen over https(so secure encrypted http in order to prevent that anyone can get access to passwords
* or JWTs.)
*
* A JWT string is an encoded string made up of 3 parts. The header, the payload and the signature.
* The header is just some meta data about the token itself and the payload is the data that we can encode into the token (really any data
* that we want, we can encode it ). So the more data we want to encode here, the bigger JWT would be.
* These 2 parts are just plain text that will get encoded, but not encrypted! Therefore anyone will be able to decode them and read them.
* So we can't store any sensitive data in there. But that's not a problem at all. Because in the third part or signature we can solve that.
* The signature is created using the header and the payload and the secret which is on the server and this process of creating the
* signature with those mentioned things is called signing the json web token.
* So again the signing algorithm takes the header, the payload and the secret to create a unique signature. Then the header and the payload
* and the signature forms the JWT, which then sent to the client. Now once the server receives a JWT to grant access to a protected route,
* it needs to verified in order to determine if the user really is who he claims to be. In other words, it will verify if no one changed
* the header and the payload data of the token. So again this verification step will check if no third party actually altered either the
* header or the payload of the JWT. So how this verification actually works? Once the JWT is received by the server, in verification process
* we will take it's header and payload and together with the secret which is still saved on the server and basically we will create a
* test signature. But the original signature that was generated when the JWT was first created is still in the token and that's the key
* for this verification. Because now all we have to do is to compare the test signature with the original signature and if the test signature
* is the same as original signature, then it means that the payload and the header have not been modified.
* If they aren't same, that means someone tampered with the data. Temperation of data is usually done by changing the payload.
* But that third party which manipulated the data, of course doesn't have access to the secret. So they can't sign the JWT. So
* the original signature will never correspond to the manipulated signature and therefore the verification would fail in that case.
* So without the secret no one will be able to manipulate the JWT data, because they can't create a valid signature for the new data.
* I mean they could manipulate the data, but it's signature will always fail in the verification step. */










