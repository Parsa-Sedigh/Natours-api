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

We have all of the express configuration in this file and this file is our entry point of our program (the default is index.js
(when you are running command npm init), but in our project we change that to app.js file)

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
was json, so that the browser knew what it was EXPECTING. But express takes that work away from us when we use .json() method.

So we create a route in order to respond to client request. So let's build api with rest architecture.

51-5. APIs and RESTful API Design:
Let's talk about APIs on a higher level and look at rest architecture which is the most used api architecture today.

What is an api anyway?
API stands for application programming interface and on a very high level, it's basically a piece of software that can be used by
another piece of software, in order to allow applications to talk to each other.
We have talked about APIs before, more specifically, WEB apis, where we simply built an app that sends data to a client, whenever a request
comes in. So imagine we have our app running on a server and we have a client and so in fact, we effectively have two pieces of software,
talking to each other right? and this is the kind of api we will build in this course and it's the most widely used TYPE of api out
there. But in fact, apis aren't only used to send data and aren't always related to web development or JS. So the application in api, can
actually mean many different things as long as the piece of software is relatively stand alone.

Our goal is that the exact same tours or ... that you see on the graphical interface (rendered website), must be get from the
API too.

An API is a service that we can request some data from it. Or in other words: API is a piece of software that can be used by
another piece of software in order to allow apps to talk to each other.
The application in API can actually mean many different things as long as the piece of software is relatively stand alone.
For example the node file system or HTTP modules. We can say that they are small pieces of software and we can use them (we can interact
with them) by using their API. So for example when we use readFile() function from the fs module, we're actually using the fs API!
and that's why you will sometimes hear the term "node APIs" and that usually simply refers to the core node modules that we can
interact with them. Or when we do DOM manipulation in the browser, we are not really using the JS language itself, but rather,
the DOM API that the browser exposes to us (or gives us access to it.)
Or another example: Let's say we created a class in any programming language like java, and then add some public methods or public properties
to it. These methods will then be the API of each object, created from that class, because we're giving other pieces of software,
the possibility of interacting with OUR initial piece of software (the objects are our piece of software in this case). So
API has a broader meaning than just (building) web apis. Anyway, a WEB api is what's most crucial for us in the context of node and so
let's now look at the REST architecture to build APIs.


Web APIs:                                                               But, "application" can mean other things:
                                 ------ browsers                         - nodejs's fs or http APIs("node APIs")
                                |                                        - browser's DOM JS API
                                | ----- native mobile app(ios)           - with object-oriented programming, when exposing methods to
database ---> JSON data ---> API                                           the public, we're creating an api
                                |                                        - ...
                                | ----- native mobile app(android)
                                |
                                | ----- native app(macOS)
                                |
                                | ---- native app(windows)

The REST architecture:
REST, which stands for representational state transfer, is basically a way of building web APIs in a logical way, making them easy to consume.
Because remember, we build an API for ourselves for ourselves or for others to CONSUME and so we want to make the process of actually
USING(CONSUMING) the API, as smooth as possible for the user. Now to build RESTful APIs, which means APIs following the REST
architecture, we just need to follow a couple of principles: (So for building restful APIs in web, we must follow these things): */

/* We need to separate our API into logical RESOURCES. These resources should then be exposed, which means to be made available,
using structured, resource-based URLs. To perform different actions on data like reading or creating or deleting data, the api should
use the right http methods and NOT the url. Now the data that we actually send back to the client or that we receive FROM the client,
should usually use the JSON data format, where some formatting standard applied to it. Finally, another crucial principle of REST apis,
is that they must be stateless.

1) Separate API into logical RESOURCES
2) Expose structured, RESOURCE-BASED URLs
3) use http methods(verbs)
4) send data as json(usually)
5) be stateless

1) The key abstraction of information in REST is a resource and therefore, all the data that we wanna share in the API should be divided into
logical resources. Now what actually is a resource?
In the context of REST, it is an object or a representation of something which has some data associated to it.
For example: tours or users or reviews. So basically any information that can be NAMED, can be a resource. But REMEMBER: A resource
has to be a name and not a verb.

2) Now we need to expose, which means to make available the data, using some structured urls that the client can send a request to.
Expose structured and resource-based URLs. Means we need to expose (make available) the data by using some structured URLs that
the client can send a request to those structured URLs. For example sth like : https://natours.com/addNewTour . So this entire address
is called the URL and that /addNewTour is called an API endpoint. So our Api will have many different endpoints like /getTour and ... and
each of which, will send different data back to the client or also perform different actions.
Another cases of API endpoints: /getTour, /updateTour. BUT : There is sth very wrong (bad) with these endpoints here.
Because they really don't follow the third rule which says that we should only use the HTTP methods in order to perform actions
on data.
Now there's actually sth very wrong with the endpoints I named and also the endpoints in below diagram. Because they really don't follow
the third rule which says(look at the next number):

3)that we should only use http methods in order to perform actions on data.
Important: So endpoints should only contain our resources and not the actions that can be performed on our resources. Because
 that would quickly become a nightmare to maintain.
So how we should use these HTTP methods in practice?
Well, let's see how these endpoint should actually look like?
For example: /getTour endpoint is to get data about a tour(our resource). So we should name the endpoint /tours and send the data
whenever a GET request (get HTTP method from client) is made to this endpoint. So in other words, when a client uses a GET HTTP method to
access the endpoint and just like this, we only have resources in the endpoint or in the url, and no verbs. Because the verb is now
in the http method(so verb is kinda implicit in the http method itself).
So with this change, now we only have resources names in the
endpoint or in the URL and no verbs, because the verb is now in the http method. Right?
Important: Good practice: Always use the resource name in plural.

Now the convention is that when calling /tours endpoint, we get back all of our tours that are in a database. But if we only want
the tour with one id (unique identifier - another example of the unique identifier is name of the tour), we add that id after
another slash OR in a search query. Or it could also be the name of a tour instead of the id, or some other unique identifier. The
detail doesn't really matte r at this point. Like /tours/7

Learn: GET and POST and... are HTTP methods.

GET(a http method or verb, which we can respond to it) is used to perform the read operation on data.

If the client wants to CREATE a new resource in our database for example create a new tour-> the POST method should be used and
the url would be like: /tours , so for POST HTTP method, we know that POST requests can send data to the DB. In this case no id will be
sent because the server should figure out the id for new resource. But for GET, the consumer should include the id of requested tour in url
or query params.

So we learned that a POST request can be used to send data to the server and so it makes sense to use POST in order to create new resources.
Now in this case, usually no id will be sent, because the server should AUTOMATICALLY figure out the id for the new resource. What's crucial
here, is how the endpoint name is the exact same name as before.

Important: So the endpoint name is exact for GET and POST for tours resource. The only difference is the HTTP method that is used for the
 request. So if the /tours endpoint is accessed with GET, we send data TO the client. But if the same endpoint is accessed with POST,
 we expect data to come IN with a request. So that we can then, create a new resource on the server side.
So that is the beauty of only using http methods, rather than messing with verbs in the endpoint names. But if we don't do this, it would
become unmanagable. So with this approach we use the difference between HTTP methods instead of using verbs in endpoints.

Next, there should also be the ability to update resources.
Learn: For updating a resource the user should make either PUT or PATCH request to the endpoint. The difference is that with
 PUT, the client is supposed to send the ENTIRE UPDATED object. But with PATCH, client supposed to send ONLY the PART of the object
 that has been changed. So with put http method, we expect that our application receives the new updated object and with patch,
 we only expect the properties that should updated on the object. So patch method is also easier for user to simply send the
 data that is changing, instead of having to send the entire new object. So we are going to make our app to work with PATCH not PUT.
 But both of them have the ability to send data to the server, a bit like POST actually, but with a different intent.
Because POST is to create a new resource, while PUT or PATCH are used to update an existing resource and also we have delete
HTTP method, again, the id or some other unique identifier of the resource to be deleted, should be part of the url in DELETE.
These are CRUD.

Usually, in order to actually be able to perform this kind of request(like DELETE), the client must be authenticated. So basically, log in
to your app.

So those are the five http methods that we can and should, respond to, when building our RESTful APIs. So that the client can perform
therefore basic CRUD operations.
You see that those http methods, map quite nicely to the basic CRUD operations.

But there might be actions that are not CRUD and in that case we just need to be creative with our endpoints. For example,
a login or a search operation.These are not really related to a particular resource and they're not CRUD operations either.
But still we can create endpoints for them. Like /login or /search.

Remember that we had two other crazy endpoint names which kind of involved two resources at the same time and that's also no problem at all
with REST(when we involve 2 resources at the same time together). Those endpoints were:
Important: /getToursByUser and /deleteToursByUser. /getToursByUser can be simply be translated to /users/<number of user>/tours.
 So this particular endpoint, could send data about all the tours that user number three has booked. Or in the case of deleting,
 there could be a DELETE request to the same or a very similar endpoint, requesting tour number 9 to be deleted, from user number three.
So we can combine resources like this.
EX) /getToursByUser ---> GET /users/3/tours                 | (possibilites are endless)
    /deleteToursByUser ---> DELETE /users/3/tours/9         |


3) Use HTTP methods(verbs). Which means to perform different actions on data like reading, creating and ... , the API should use the
right HTTP methods and not the URL.

4) Send data as JSON(usually). Means the data that we send back to the client or the data that we received from client, should usually
use JSON data format.

About the data the the client receives, or that the server receives from the client, usually we use the JSON data format.
So let's briefly look what JSON actually is and how to format our API responses. JSON is a very lightweight data interchange format which is
heavily used by web APIs, coded in any programming language. So it's not just related to JS and it's so widely used today, because it's really
easy for both humans and computers to understand and write JSON.
JSON looks a bit like a regular JS object, with all those key-value pairs. But there are some differences and the most crucial one is that all
the keys have to be strings. It's also very typical for the values to be strings as well, but they can be other things like numbers, true or
false values, other object(s), or even arrays of other values.

We could send our JSON response to the client in JSON formatting, but usually we do some simple response formatting before
sending. There are a couple of standards for this and we're gonna use JSend.
In JSend we simply create a new object, then add a status message to it in order to inform the client whether the request was a success,
fail or error and then we put our original data into a new object called data and we can develop this even a further, but this is the
simplest way of formatting with JSend and by the way, wrapping the data into an additional object, like we did here is called enveloping
and it's a common practice to mitigate some security issues and other problems.
Other response-formatting standards: JSend:API and OData JSON protocol and ...

EX)
{                                                             {
  "id": 5,                                                      "status": "success",
  "tourName": "...",        response formatting                 "data": {
  guides: [                 --------------->                      "id": 5
    {...},                                                        ,
    {...}                                                         ...
  ]                                                           }
}

5) Be stateless.
In stateless restful API, all state is handled on the client and not on the server and state simply refers to a piece of data
in the application that might change over time.For example, whether a certain user is logged in or on a page with a list of
several pages, what the current page is?
Now the fact that the state should be handled on the client means that each request must contain all the information that is
necessary to process a certain request on the server.
So the server should never ever have to remember the previous request in order to process the current request.
For example in a list with several pages, we currently are in page 5 and want to move forward to page 6. So, we could have a
single endpoint called /tours/nextPage and submit a request to it. But the server would then have to figure out what the current
page is and based on that, send the next page to the client.

Bad practice for this example:  In other words, the server would have to remember the previous request. So it would have to handle the
state, server side and that is exactly what we want to avoid in REST apis. So this is a bad practice.
Plan: GET /tours/nextPage -> web server: nextPage = currentPage +1;
                              send(nextPage); //The state is currentPage variable and it's on server side.So this is a bad practice!!!

Good practice for this example: Instead in this example we should create a /tours/page/<number of page> endpoint and pass the number
6 to it, in order to request the page number 6. This way, we would handle state on the client side, because on the client,
we would already know that we are currently on page 5 and so all we have to do is to just add 1 and then request page number 6.
So the server doesn't have to remember anything in * this solution and all it has to do is to send back data for page number 6 as we requested.
and by the way, statelessness and statefulness, are very crucial concepts in computer scinece and application design in general.

Stateless RESTful API: All state is handled on the CLIENT. This means that each request must contain ALL the information necessary to
process a certain request. The server should not have to remember previous requests.

Examples of state: loggedIn - currentPage

currentPage = 5

BAD:
                                                  (state on the server)
                                                          ^
                                                          |
GET /tours/nextPage ---> web server:  nextPage =       currentPAge              + 1

GOOD:
          state coming from client
                ^
                |
GET /tours/page/6  ----> web server:  send(6)


Diagram:
Resource: Object or representation of sth, which has data associated to it. Any information that can be NAMED, can be a resource.
EX) tours - users - reviews

            URL(all of the string)
https://www.natours.com/addNewTour
                        ENDPOINT(the slash is also included)     |
                        Other examples:                          |  BAD
                        /getTour                                 |
                        /updateTour                              |
                        /deleteTour                              |
                        /getTourByUser                           |
                        /deleteTourByUser                        |

Endpoints should contain ONLY RESOURCE(nouns) and use http methods for actions!

7 is Tour id.

/addNewTour ---> POST /tours       Create
/getTour    ---> GET /tours/7      Read
/updateTour ---> PUT  /tours/7
            |                      Update
            ----> PATCH /tours/7
/deleteTour ----> DELETE /tours/7  Delete*/
/* 52-6. Starting Our API Handling GET Requests:
We start by building the API and then the dynamically rendered website. In order to look at express and mongo and mongoose, the tutor
find it easier to just work with data and not to worry about the graphical  stuff, even though that's maybe a bit more exciting, but for
first step, it's better to just deal with the data itself.

For example on the final product, if you send a GET request to https://www.natours.dev/api/v1/tours the response we get back, is the
exact same tours that we see on the graphical interface(actual website).
Also if you try to send a request for getting users(/api/v1/users), you can't access them, because we need to be authenticated. So we would
need to log into our app.

Let's implement the tours route. You COULD use v1 after the '/api' . So you can write: /api/tours or /api/v1/tours.
It's a good practice to specify the API version.

So basically you can branch off and create a new version of your API, while old users can still using the old one. But if we didn't use
different versions and changed the current api, the api would break for the users that were using it. So it's good to have
versioning. Otherwise, then the users wo started to use it before you did the changes, would run into problems.
By doing this, in case you want to do some changes to your api, you can do that BUT then on V2(or one version upper - not the
current version, because that would break the users who are using the current api and don't know about the changes), without breaking everyone
who is still using v1.
So we always should specify the version of the api. We could also do it in the subdomain, but it's easier to just simply include it in
the url.

The second arg of .get() or .post() or ... (that callback function which has the req, res ,...) is called route handler.
Now in this case the tours is our resource. For sending back our data, we must first read the file of our data, but we must
do this reading out side of route handler and at the top-level code (top-level code is only executed once which is rightafter the
application starts.)

The data in dev-data folder is an array of JSON objects which then has a bunch of data about each of the tours.

Before we can send the data, we actually need to first READ it and so again, we don't do it(reading data) inside the route handler, but we
dp it before and we can do that, because the top-level code is only executed once, which is right after the application startup.
So only the route handlers(the callback functions) will run inside the event loop and so in route-handlers we can not have any blocking code
which reading data is a blocking code. But outside of route-handlers, it is no problem at all.
So let's simply read the tours into a variable outside of all of that handlers, in a synchronous way.
Important: The code outside of route-handlers will only run when the server startups.

It's better to require node.js core modules first and then require the dependencies that you installed with npm (IF you
need the core modules of course!)

Important: __dirname is the folder where the current script is located and in the case of app.js , that is that main folder(root??).

When you want to send data, you must do it in Jsend format.So first we must add a status property code that can be either
success, fail or error in our json and then data property which is called envelope for our data, would be an object that contains
our actual data(the data that in response we want to send to client- But remember the format is key value pair,so we must use a
key name for the data that is in the data object, in this case the key name is also named tours.)

It's good to specify the status code always, even if 200 is standard, it's good to do it in each and every single response and for
response, we want to use the JSend JSON formatting standard. So in that json, specify the status property and that can either be
'success', 'fail' or 'error'.

'success' status is for 200 or 201 or 2<><> status range(any code that starts with 200).
'fail' is an error at the client.
'error' is for when there was an error at the server.

The data property at the JSend, is an envelope for our data. So we specify that data property and that data will then in turn have an
object as it's value, which then contains the data or the response that we actually wanna send and for case of '/' route, we want to send
the tours.
Learn: In ES6, we don't need to specify the key value pair if they have a same name.But here we should specify the tours key,
 because it's the name of the resource and also the name of the endpoint and this is why inside the data object we send back
 the tours property.

In data property of '/' route, we named it tours, because that is the name of the resource and of the endpoint and so that's why inside of
the data property, we send back an object that has the tour property.

So in this case, we read our data and then we formatted our response, using the JSend data specification.

When we are sending MULTIPLE RESPONSES, it's good to include another field (or another key value pair) called `results` when
we would have multiple results in response and in the results field we specify the number of results that we are sending back.
(It's not a part of Jsend specification, but we do this because this makes very easy for client to get a very quick information about
the data it is receiving.)
Recap: So including the results property next to the status property only makes sense whenever we are sending an array(multiple objects),
if we were sending only one tour, we wouldn't do this.

At this point we have like a file-based API, so we're reading that data from an API, but later we're gonna store this data in a DB and then
read it from there.

Now let's take care of the POST request, so that we can add a new tour to our data.

53-7. Handling POST Requests:
Just as we talked about in the REST API lecture, the url is exactly the same here. So no matter if we want to get all the tours, or if we
want to create a new tour, the url is exactly the same. The only thing that changes in this case, is the http method that we use for doing
these requests.

We know that req object holds all the data about the request that was done from the client. But Out of the box(in POST request I'm talking),
express does not put that body data on the request and in order to have that data available on the req object, we
have to use something called middleware. So we need to include a simple middleware at the top of the app.js file.
So we say : app.use(express.json()); In this piece of code, express.json() is a middleware and middleware basically is just
a function that can modify the incoming request data. So it's called middleware because it stands BETWEEN, or in the middle of
request and response. So it's just a step that the request goes through, while it's being processed and the step that request goes
through in this case is simply that the data from the body, is added to req object by using that middleware. So body is a property that
will available on the req object because we used that middleware.
We use app.use() to use a middleware inside of the parentheses.

By using that express.json() middleware, body is the property that is gonna be available on the req, because we used that middleware a couple
of moments ago.

Learn: When using app.use(express.json()) middleware, when the client send some json to the server in a for example, POST request,
 req.body would no longer in JSON format but is a JS object. If you don't use that middleware, the req.body would be undefined, because
 it no longer exists.
 Also remember that in order to actually get the body data from the req that sent to our server, the request must be in JSON format
 and not anything else!

Important: We always have to send back something in order to finish the request/response cycle.

In postman, first, you can create a new collection and then save requests in that collection(later we will put the requests in their
related resource folder which those resource folders are inside that collection).

The body tab in postman is the data that we want to send to the server and there are different ways of doing it, but the easiest one is
to select raw and then JSON(application/json) and then specify some json which that will then get transimtted to the server.

Now we want to persist the data we get from the post request, into tours-simple.json file. So we're gonna modify that file, so that the
data is saved to our fictional DB which is that file. So that file kinda works as our fictional DB.
The first thing we need to do in this case, is to figure out the id of the new object. So remember, again in the lecture about REST APIs,
important: when we create a new object, we never specify the id of that object, the DB usually takes care of that. So a new object
 (which in this case, is coming from POST request), usually automatically gets it's new id.
Well in this case, we do not have any DB and so what we're gonna do is to simply take the id of the last object and then add 1 to that.
Also, we already have the data in that tours variable(const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)));
and that's an array of all the tour object and we want to get the last one which is tours[tours.length - 1];
Then we created newTour constant, which will be the body that we send plus the new id that we just created.
Important: Object.assign() allows us to create a new object by merging two existing objects together.
In this case, the first object is gonna be: {id: newId} and then req.body object. So in this case, the {id: newId} is the first object and
req.body is the second object that we merge together. Now we could also had done: req.body.id = newId; but we did not want to mutate
the original body object and therefore we just left it like that.
So that is the new tour and now what we want to do is to push that tour into the tours array. So use push() .
So now, the tours array has the newTour in it, but of course now we have to PERSIST that into the file. So we need to write into the file,
but which method do we use? writeFile() or writeFileSync()?
We're inside of a call back function that is gonna run in the event loop and so we can never, ever block the event loop. So what we're
gonna do is to use writeFile() and not the sync version in this case. So we want to pass in a callback function that is gonna be processed in
the background and as soon as it's ready, it's gonna put it's event in one of the event loop queue, which is then gonna be handled, as soon as
the event loop passes that phase.

The first arg of writeFile() is the path to file where we want to write to, the second arg is the data we want to write it and then our
callback function.
Remember: The tours variable right now, is just a plain normal JS object and so we need to convert that to JSON, because the data in
tours-simple.json file are in JSON format. So use JSON.stringify() .
In callback function, we specify what we want to do as soon as the file is written. What we usually do, is to send the newly created object
as the response.
The status code in this case, is not gonna be a 200, but a 201 which means: created.
200 stands for ok, 201 stands for created. In this case, we created a new data for our resource on server(created a new resource on the
server).
Because we're sending only one result, we don't specify the results property in response. In response object, data is our envelope.

So:
EX)
app.post('/api/v1/tours', (req, res ) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
});

When you get this error:
Error: [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client.
happens when you try to send two responses(so 2 times of res.send())*/
/* The callback function after the url is called route handler. For better practice, we can export all of the handler functions and
create a new function out of them for each one.

Currently, if you send a GET request to /api/v1/tours , the newly created tours shouldn't yet show up. BUUUUT IT IS ALREADY THERE!
Why?
Because I THOUGH(which in this case wrong!), that the newly created tour wouldn't show up right away, because that only works if we
restart the server. Because that tours-simple.json file is only read AT THE BEGINNING when we START THE SERVER. Why? Because we wrote it
at the top of app.js file, so it would be executed ONLY when we start the server.
But the thing that invalidate my thought, is that each time we SAVE STH to that JSON file, it will also RELOAD THE SERVER and that's why
each time we save sth there with our api, it will then immediately reload the server and will reload the content from the file into the
tours variable, which is in the top of app.js and we can then read that right away and so that's why we have access immediately to all the
newly created tours. */
/* 54-8. Responding to URL Parameters:
Let's look at an easy way of defining parameters right in the url, how to then read those parameters and also how to respond to them.
If we hit the /tours endpoint without any id, then we would get all the tours, but if we would specify an id in the url like: /tours/5 and
of course it doesn't have to be an id, it can be any unique identifier, it would give us only one tour.
That id in url is a variable, because it can be anything and so that piece of url, is a variable and so we need to define a route which
can ACCEPT a variable.

A route is basically a URL and also the http method.
 app.get('/', (req, res) => {

     Into .json() method we must pass in an JS object and also by using .json() method, the 'Content-Type' of our header for response
     automatically set to 'application/json' . But if you don't use express, it wouldn't set to 'application/json' automatically.
     Also express set some other headers automatically in our responses.
    res.status(200).json({
        message: 'Hello from server!',
        app: 'Natours API'
    });
});


 app.post('/', (req, res) => {
     res.send('OK this is post');
 });

 Remember: __dirname is the folder where the current script is located (the script that we are actually running the __dirname
from it.)
 IMPORTANT: We use JSON.parse() to convert a json string to an array of JS objects.
 Each time we save something in this file with our api (like creating a new tour in the file), it will then immidiately reload the server and
 will reload the content from the file into the tours variable and then we can read that right away.

 const appFileName = __dirname.replace(/\\/g, '/');
 const tours = JSON.parse(fs.readFileSync(`${appFileName}/dev-data/data/tour-simple.json`));

2) Route handlers

 app.get('/api/v1/tours', getAllTours);

The id (for example 5) in the URL is a variable. So we must define a route which can accepts a variable and we define that
variable in URL with :<variable>. So we define a variable using colon in url. So with :id, we created a variable called `id`.
req.params is where all of the parameters (all of the variables) that we defined in the URL are stored there.(The variables in the
URL are called parameters and they live in req.params .)
req.params is an object which automatically assigns the value to the parameters of that route.

If you have a route like '/api/v1/tours/:id/:x' and in request URL, you send a request to '/api/v1/tours/:id', there would be an error.
Because we are not hitting that EXACT URL(route) that we defined in our server, but an other URL, so it would throw an error. But we can
also make optional parameters by saying :y? and the y would be optional, so if we don't specify it, it(the y property) would be undefined
in req.params and won't throw an error.
Learn: .find() works on arrays and in () of this method we pass in a callback function and this method will loop through the array
 automatically and in each of the iterations, we will have access to the current element and we will return either true or false in
 each of the iterations.Now what the .find() method will then do is that it basically create an array which only contains the element where
 the condition is true about that element.
 So with this condition we specified in the callback function we ensure that only the element where the condition is true about it,
 will get returned from the .find() method and stored in the tour variable.
EX) const tour = tours.find();

app.get('/api/v1/tours/:id', getTour);

Learn: The values that come from the URL parameters are string.
So in this case, we need to convert the id parameter to number for comparison in find() method. So we can multiplies it by 1.
This is a nice trick that when we multiply a string that looks like a number (like '23') with a real number, that string will
then automatically converted to a number.

Also tours[tours.length - 1] is the last item in tours array.

So we need to convert req.params.id to a number.
const id = req.params.id * 1;
const tour = tours.find(el => el.id === id);

Currently, if you request for a tour that doesn't exist, like hitting the url with id of 23, we get nothing back, but we still return
200 ok as the status code of this response and that doesn't make sense.
As a very simplistic solution, what we want to do is to check if the inputted id is valid or not? (if it exists in our file or not?).
In this case, we want to check if the id is larger than the length of the tours array and if it is longer, then we can send back a 404
error and say that we could not find any tour of that given id.

First solution: We want to exit this function right now and we don't want to calculate tour variable or any other code further,
so we say: return ... .

When we have a 400 code status, we can say 'fail' in json.

Another solution to find out if an inputted id by user is invalid is to first calculate the tour variable(find the tour
based on the inputted id from user) and then if statements...

First solution:

Important: Always, check if the user input is valid and safe, so if it doesn't contain any malicious code or really anything that we don't
 want in our app.

I commented out these lines, because we are using this exact code in param middleware in this file(tourController) to avoid repeatness of code.
const id = req.params.id * 1;
const tour = tours.find(el => el.id === id);

  if (id > tours.length) {
      return res.status(404).json({
          status: 'fail',
          message: 'Invalid ID'
      });
  }

Second solution:
We get the id from user's input(after some validation), then we would try to find a tour and if there was no tour, then we would say that
the id is invalid.
Remember: The result of find, if there wasn't any element matching that condition, is undefined. So we CAN check for !id here.
  if (!tour) {
      If tour is undefined:
      return res.status(404).json({
          status: 'fail',
          message: 'Invalid id'
      });
  } */
/* 55-9. Handling PATCH Requests:
We have two http methods to update data, PUT and PATCH. With PUT, we expect that our application receives the ENTIRE new updated object
and with PATCH, we only expect the properties that should actually be updated on the object. So usually the tutor likes to use PATCH, because
he find it easier to simply update the properties that were updated. At least, when we start using mongo and mongoose, it will be much easier
to just do it like that. That's also easier for the user to simply send the data that is changing, instead of having to send the entire
new object. So again, we're gonna make our app work for PATCH and not for PUT. So we expect a PATCH request to come in on the url of:
'/api/v1/tours/:id' and also we need the id of the tour that should be updated. So the url must also have :id .

Remember: When you CREATE a new thing on resource, we send that newly created data back. For updating a tour in format of file-based DB,
we would have to get that tour with that received unique identifier from the JSON file, then change that tour and then save it again to that
file.

When we update an object or a resource, we send back 200(OK) as status code and as data, we send back that updated data(in the case of
updating a tour, we send back that updated tour).

56-10. Handling DELETE Requests:
When we have a delete request, the response is usually 204 status code and 204 means : no content and this is because as a result
we usually don't send back any data. Instead we just send null as response(the data property would be set to null). The status is still
'success', but the data property is null, in order to show that the resource that we deleted now no longer exists. So that is what null
means in this context. So it's pretty similar to PATCH, the difference here in this case is, that we change the DELETE method and status code
and the data that we send back.
We must set the resource (in this case tour) to null to show the resource that we deleted no longer exists.
In this case, postman will show us no content at all. Even won't show the json we send back to the user of API. But it gives them
204 status code.
Remember: In restful API, it's a common practice to not to send back any data to client, when there's a delete request.
So we didn't store the result of Tour.findByIdAndDelete() to any variable.

57-11. Refactoring Our Routes:
Ideally, all the routes should kind of be together and then the handler functions also together, so they must be separate from the routes.
So let's export all of those handler functions into their own function.
Now cut the handler function of the routes and create a function for each of them.
For example:
EX)
const getAllTours = (req, res) => {...};
and then, as the second arg of app.get('/api/v1tours', ) pass ONLY the name of the function WITHOUT any ().
Other handler function names are:
getTour() for /tours/:id, createTour(), updateTour(), deleteTour() .

Now we can do even better. Because let's say that we want to for example change the version(currently it's v1) or the resource name, we
would then have to change it in all of those places(currently 5 places).

...
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

When we want to for example change the version of our api or change the resource name, we must change those in all of our routes.
So we must do it in better way(best practices). So we use app.route() .
Learn: app.route('/api/v1/tours').get(getAllTours); is exactly as app.get('/api/v1/tours', getAllTours); and for other http methods is
 like this one. But the advantage of first piece of code is that we can chain the post http method and other http methods that have
 on that same route. So with this style, we only use the url, once for all of the http methods that have same route. So editing the urls
 now is a lot easier.
So with this way, we have now created an even better way of writing a route, because right now, the url is not repeated for GET and
POST in this case.
So now we have:
app.route('/api/v1/tours')
   .get(getAllTours)
   .post(createTour)

Now let's do the same for the other route('/api/v1/tours/:id')
So instead of repeating the url for each http method, we make the same urls together and then chain the http methods that use the same
url.
Recap: We separated our handler function of the routes itself, so that we can later actually, even export those into another file.

So the same actions for each of the routes, are now together. */

/* 58-12. Middleware and the Request-Response Cycle:
Let's see how express works and for that, we need to talk about middleware and the request-response cycle.

request-response cycle: To start this cycle, our express app receives a request when someone hits our server, for which it will then
create a req object and a res object. That data will then be used and processed in order to generate and send back a meaningful
response. Now, in order to process that data, in express, we use something called middleware. Middleware can manipulate the
req or res objects or execute any other code that we like. So middleware doesn't always have to be just about the req or res object,
but it usually is mostly about the request.For example we used express.json() to get access to the request body on the req object.
Now it's called middleware because it's a function that is executed BETWEEN, so in the MIDDLE of receiving the request and sending the response.
So we can say in express, EVERYTHING is basically a middleware. Even our route definitions. So again, even when we defined our routes,
we can think of the route handler functions that we wrote, as middleware functions. They are simply middleware functions that are only
executed for certain routes. Another middleware is express.json() which is also called body parser. Or some  logging functionality or
setting some specific http headers. The possibilities are endless with middleware.
All the middleware together that we use in our app, is called the middleware stack.
Important: The order of middleware in the stack, is actually defined by the order they are defined in the code.So a middleware
 that appears first in the code, is executed before another middleware that appears later.So the order of code matters a lot in express.

You can think of the whole process like this:
Our request and response objects that were created in the beginning, go through each middleware where they are processed or where
just some other code is executed. Then at the end of each middleware function, a next() function is called, which is a function
that we have access to in each middleware function (Just like req and res objects that we have access in each middleware).
So when we call next(), the next middleware in the stack will be executed with same req and res objects and this happens with all
the middlewares, until we reach the last middleware and so just like this, the initial req and res objects, go through each middleware,
step by step and You can think of this whole process, as kind of a pipeline where our data goes through(so just like it's been piped) from
request to final response.
About that last middleware function, it's usually a route handler. So in that handler, we actually don't call the next() function to move to NEXT
MIDDLEWARE(So we don't call next() to go to next MIDDLEWARE, but maybe we call next() to go to another route handler function! All right?)
Instead, we finally send the response data back to the client.So with this, we finish the request-response cycle.
So this cycle starts with the incoming request then executing all the middlewares in middleware stack step by step and finally sending the
response, to finish the cycle. Important: It's a linear process.
Learn: In order to use middlewares, we use app.use(). So use() method adds that middleware to the middleware stack.

The essence of express development: The request-response cycle:

"Everything is middleware"(even routers)          "pipeline"

                --------------------------------middleware stack-----------------------
                                              (order as defined in the code)

                     // middleware    //middleware      // middleware      // middleware
incoming request --- ...         ---- ...         ----- ...         -----  ...          --------->  response
                     next()           next()            next()             res.send()
                     ^                  ^                 ^                     ^
                     |                  |                 |                     |
                e.g: parsing body    e.g: logging   e.g: setting headers      e.g: router

--------------------------------request-response cycle------------------------------------------------------

59-13. Creating Our Own Middleware:
In order to use middleware, we use app.use() . So the use() method is the on e that we use, in order to use middleware and
important: using a middleware means add that middleware to the middleware stack.
When you have: app.use(express.json()), by calling that json() method, it returns a function and so that function is then added to
the middleware stack and similar to that, we can create our own middleware function. So first write: app.use() and then in () of .use() ,
we need to pass in our function that we want to add to the middleware stack.
Important: remember: In each middleware FUNCTION, we have access to the req and res object. But also, we have access to the next function which
 is the third arg of middleware function and like that, express then knows that we are actually defining a middleware there.
Just like before, we could have called those arguments of middleware function sth else, for example we could name the next (third arg of
middleware functions) arg, x or n , it doesn't matter, what matters is that it's the third argument to that function. So express basically
passes the `next` function as the third argument into that middleware function and we can then call it whatever we want.
If we don't call next() in middleware, then the request-response cycle would be stuck at that point and we wouldn't be able to move on and
we would never ever send back a response to the client. So it's crucial to never forget to use next(), in all of your middlewares.
Now for testing our own new middleware, we need to send a simple request to our api and currently which api doesn't matter, because that
of course, applies to every single request and after sending request, you see the code in our middleware gets executed. But why that middleware
which we currently is placed in the beginning of app.js , applies to each and EVERY single request?
Because we didn't specify any route. Remember, I said that all route handlers are kind of middleware themselves.
Important: They(route handler functions) are simply middleware functions that ONLY apply for a certain url(route). But those more simple
 middleware functions that we define for example in the beginning of app.js (which aren't responsible for any routes and are before the
 route handlers), they are gonna apply to EVERY SINGLE request. Why I said "if they were before the route handler functions"?
 Because after the middleware chain of route handler functions ends, the middlewares that are AFTER the route handlers won't get called!
 At least, if the route handler comes before(I think tutor is wrong, it must be AFTER) that generic middlewaer.
 So if we cut that middleware from beginning of app.js and paste it AFTER the route handler middleware function which would
 be called(is responsible) for the request that we're gonna send.

What do you think is gonna happen now?
EX)
app.route('/api/v1/routes')
   .get(<route handler function>)

// the generic middleware:
app.use((req, res, next) => {... next()})

In this example, that generic middleware wouldn't get called if you send request to /api/v1/routes. Why?
Because that route handler comes BEFORE that generic middleware and we know that at the end of the chain of route handler functions,
the request/response cycle gonna end(for example by sending a response(result) with res.json()) and therefore the next middleware in the
middleware-stack which in this example is that generic middleware will then not be called(again, because the cycle has already finished).
So order matters a lot in express.

Now if you had:
EX)
app.route('/api/v1/routes')
   .get(<route handler function>)

// the generic middleware:
app.use((req, res, next) => {... next()})

app.route('/api/v1/tours/:id')
   .get(getTour)
   .path(...);

and do a request to '/api/v1/tours/:id' route, that generic middleware would be executed. That's because that middleware, is BEFORE
the route handler, so it gets executed and so it is part of the middleware-stack that gets executed before the request/response cycle ends.

Important: Usually we define those kind of global middlewares(like the generic middleware that we have in example above, before ALL our
 route handlers), like for example, we put those general middlewares, at the beginning of app.js.

We can define a property on the req object inside a middleware by saying: req.<property name> = ...;

Remember: new Date() translates to right now and by calling .toISOString() it will convert the result of new Date() into a readable string.
So let's pretend we have some route handler that needs the information about when exactly the request happens. So we can do that
by adding a property to req object using middleware like what I said with new Date().
Also don't forget to call the middleware in the stack by calling next().*/
/* 60-14. Using 3rd-Party Middleware:
Let's use a third party middleware function from npm called morgan in order to make our development life a bit easier. So we're gonna use a
middleware called morgan which is a logging middleware.

morgan is a 3ed party logging middleware function that allows us to see request data in the console. This package makes development easier
but still IT IS SOME CODE that we include in our app so this package is not a development dependency and it's a regular dependency.

Now as I mentioned, that logging middleware is gonna make our DEVELOPMENT life easier, but it still is code that we will actually include
in our APP and so that's why it's not a development dependency but a simple regular dependency.
Now let's require it in app.js after requiring express package.

It's a convention that the name of the RESULTING thing(left side of equal) that require('...') is gonna expose, is usually the
same name as the package name itself. Therefore we named the result thing of requiring 'morgan', as the same name of package, morgan.

The order of things in app.js(one single file) currently is(the order is crucial!):
1) middlewares
2) route handlers(route handler middleware functions which get req, res, next, error just like any other middleware)
3) routes(route definitions
   ex: app
          .route('/...')
          .get()...)
4) starting the server code

Now use morgan middleware before the express.json() middleware.
Into the morgan() function, we can pass an argument which will kind of specify how we want the logging to look like. So we can use
some predefined strings for that and the one that we're gonna use is called 'dev'. The different options are: combined, common, dev,
short, tiny.

Calling the morgan() will return a function similar to (req, res, next) => {...} function, because this is how a middleware function
has to look like. We can prove that, by looking at the source code of that package. Search for it on github, then go to index.js which is
usually the entry point and in case of morgan package, it's kind of the only file that there is!!!
The main export from index.js file of morgan package, is morgan(module.exports = morgan). So a function called morgan is exported.
So when we require the morgan package, what will get returned is the morgan function. Because they used module.exports = morgan and that
is the default export. So the morgan function that we called in app.use(morgan()) is the morgan function in index.js which is exported.
morgan function actually returns another function called logger and this logger function has the very typical middleware signature which
is (req, res, next) => {...} (like our OWN middleware functions) and in the end when it's ready, it calls next().
So it's just a very regular middleware function just like the ones that we write.

After using this middleware if client send a request to server, we get http method, the url, the status code, the time it took to
send back the response and also the size of response in bytes. You can also save these logs to a file.
If you used 'tiny' option of morgan(), that log would look different. It's actually quite similar and the differences is that it doesn't
do that coloring of the status code in log and also it has a slightly different order.
This is useful for development.

This is how we use third-party middleware from npm.

On express website and on it's resources/middleware you see a bunch of middleware that express recommends and actually express recommends
those, because many of those used to be built-in in express 3, but were then taken out of express. For example body-parser is one of them,
but actually in version 4.14 or 4.16, it was added BACK and so that's why we were able to use express.json() , in order to parse the data
from the body. Before that, we actually would HAVE TO use the body-parse from NPM(yeah, you needed to install it separately, because
it wasn't the part of express itself, but now you don't need to, because it's built-into express) and use that one to parse the data from the body.
But again, they just recently added it back to reduce the confusion a bit for beginners.


61-15. Implementing the Users Routes:
Let's implement some routes for the user's resource. Our api will have a couple of different resources. Like tours and users resources.
For users resources, so that, for example, we can create user accounts and have different user roles and all of the things that come with
users.
This users resource will be very similar to the tours resource. So let's define:
app.route('/api/v1/users')
   .get(...)
   ...
So the structure we're following is similar to the one with tours.
Important: So when we do GET or POST on the route without the id(a route that hasn't an id in it - like: /api/v1/tours), it means that we
 either want to get all the users, so basically all the objects that are part of one resources(in case of GET) and if we use POST, then
 we want to create a new resource on a server. If you have :id in route and do a GET request that has a :id in it, it means that we want
 to get one resource(in case of the user resource, one user).

For naming the route function handler of a GET request which has an :id in it, there are different kind of standards there.
So in case of user resource, you could call the handler of /:api/v1/users/:id , getUser() , getOneUser() . But the tutor prefers to
call it getUser() .

This pattern is always gonna be the same.

After defining /api/v1/users route and it's handlers(for it's GET and POST and ...), now define /api/v1/users/:id .

Important: When defining routes like in app.route() , you always need to start with a slash.

Now let's define the route handler functions BEFORE the place we're using them(because in strict mode, you need to define the function
you're gonna use, first and then you can use it).

When you create a new resource, create a separate folder for it inside the same collection in postman.

Handlers are also called controllers(route handler functions).*/
/* 62-16. Creating and Mounting Multiple Routers:
Let's create multiple routers and use a process called mounting. The ultimate goal currently is to separate all the code that we have
in app.js , into multiple files. What I want, is to have one file that only contains all of those routes for one resource, so one file for
all of the routes of tours, one file for all of routes of users.
Also a file which contains the handlers only for the users and then also one file that will contain all the handlers(controllers) for the
tours. We're gonna do that in next lecture, but in order to be able to do that, we actually need to now create one SEPARATE ROUTER FOR
EACH OF OUR RESOURCES.

When you have multiple routers, you must use a process called mounting.

Right now, we can say that all our routes(currently we have 4 routes), they're all kind of on the same router and that router is that app object.
But if we want to separate our routes into different files (one file for tours routes(one resource) and one file for users routes(another
resource)), then the best thing to do, is to create one router for each of the resources.
For creating new router, we say:
const <resourceName>Router = express.Router() ,so we save it to a variable and that variable becomes the router.
With that, we create a new router and save it into a variable. Now we can use this variable instead of app.route() .
So now instead of:
app.router('url').get().post()...

we have:
<resourceName>Router.router().get()... .

Now how do we connect that new router(like tourRouter) with our application?
We will use it as middleware and that is because, that new modular tourRouter, is actually a real middleware.
So the result of calling express.router() is a middleware. So we can say:
app.use('/api/v1/tours', tourRouter);
Note that I didn't specify the route for .use() and just pass it an empty string, we will specify that later. As second arg, we pass in the
tourRouter to use it on our application.
Now where do we want to use the tourRouter?
We specify that place by specifying the first arg which is the route that we want to use the tourRouter.
So again, that tourRouter is a real middleware and we want to use that middleware for that specific route which we specified it as the first
arg of app.use() and just like this, we created a sub application
Learn: If you want to use a middleware ONLY on a specific route, for the first arg of app.use() , pass the route you want to use that middleware
 and as the second arg, the middleware itself.

Important: So by using this app.use() and specifying the route in first arg, we can specify WHERE we want to add this middleware to
 our app (middleware stack).
So we want to use the tourRouter middleware for a specific route that is specified in first arg of app.use().
Learn: So if you specify a route (URL like thing!) in first arg of app.use(), the middleware that is specified in second arg would be
 used in that exact URL and not anywhere else. So with this, we created a sub application. Now we must change the url in .route() methods
 relative or based on url we used in first arg of middleware.
 So if you has the /api/v1/tours in the first arg of .use() of a router, you need to remove that part from the specified url of route handler
 functions. For example, change the url for handling /api/v1/tours/:id to /:id .
Now why we must change those urls?
Because the '/api/v1/tours' is already in the parent route of our mini application. So we just specify the additional or continuation
of the url in .route() methods. In other words, it's because that tourRouter middleware, only runs on that specified route(first arg of .use())
anyway and so once we are in the router, then we ALREADY ARE AT THAT ROUTE and so that first route now become the root of that specified
route of .use() (so the root of that small mini-application).

Because remember: app was our earlier router:
EX) app
     .route('/api/v1/tours')
     .get(getAllTours)
     .post(createTour);

Now every route that we pu t in tourRoutes.js file is relative to '/api/v1/tours' URL. Because this URL is the base URL for any route in
tourRoutes.js file.
Important: The whole router in tourRoutes.js is mounted on '/api/v1/tours' route. So all of the routes in that file are related to
 '/api/v1/tours' URL. Because they are mounted on this URL.

In other words, we removed the url that is on the app.use() (when we create routers), because that part of url is ALREADY in our kind of
parent route(app.use(<'parent route'>), resourceRouter)

So actually when we create a router system like what we have for tours, we actually say that we kind of created a small sub-application for
each of those resources.

Let's say that we have an incoming request now for /api/v1/tours/:id . So the request goes into the middleware stack and when it hits that
app.use('/api/v1/tours/', tourRouter); it will match that route(first arg) and therefore our tourRouter middleware function will run.
Remember: Our tourRouter is that sub-application that we created, which in turn, has it's own routes(which are relative to the route
we specified in app.use() of that sub-application) and if the request was for /:id, then, it will inside our mini app hit that /:id route and
it will run one of the handlers of that .route('/:id') , depending on the method that was used for the request.

In other words:
Now when a request goes into the middleware stack and after that if it's url hits '/api/v1/tours' url, the tourRouter middleware function
will run. So the tourRouter is a sub application which has it's own routes and if the request was for / , the http methods for '/api/v1/tours'
would run and if the request was for /:id the http methods for '/api/v1/tours/:id' would run. So '/:id' in sub application means:
'<entire route>/:id'

Now let's do the same for users resource. So let's create another router for that resource, called userRouter and then replace app.route(...)
with userRouter.route().... .

So mounting a new router on a route is called mounting router. So when you for example add tourRouter for /api/v1/tours (so when you
do this: app.use('/api/v1/tours', tourRouter)) you are mounting.
Remember: First you have to create the router variable and THEN use app.use() to use that router to create sub applications. So we can not use
routers before we declare them.

So we mount new routers for routes.

Important: You could place app.use() middlewares after defining the routes. So after codes like tourRouter.route()... or userRouter..... ,
 you could place app.use(...) . But YOU MUST PLACE app.use() codes AFTER DEFINING THE ROUTER VARIABLES. Because you must initialize the router
 variable before using it. So let's place app.use('<route>', resourceRouter); AFTER defining the routes of that min-app.
 So we can not use the routers, before actually declare them.

So now when a request hit that app.use('/api/v1/users', userRouter); , it will run the userRouter, because that route(first arg of app.use()),
is matched and then it enters the userRouter and again

Remember: userRouter.route('/') is the root in our sub-application.

Then change the routes for user resource, RELATIVE to it's parent route(app.use('<parent route>', ...)) .
It's better so separate routers into different files. So we should cut
tourRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);
and any other router and take it to it's separate file. Also we take the route handler functions and take them to those separate router files too.
But we will also create a separate file for each resource route handlers functions too.
For example : app.use('/api/v1/tours', tourRouter) means: mounting the routers (like tourRouter) on different routes(like '/api/v1/tours').
Learn: Each router is kind of mini sub-application for each resource.

Now let's separate different routers into different files.*/

/* 63-17. A Better File Structure:
Remember that we wanted to separate our routers into different files and that's the first step. So create a new folder called routes and
then in there, we will have one folder for tour routes called tourRoutes.js and then userRoutes.js and this is gonna be the first time that
we will really work with different modules and actually use them in a meaningful way. Now copy and paste the tourRouter = express.router() and
the tourRouter.router()... s into tourRouter.js . Also there(tourRouter.js), we need to import the express module.

Now it's kind of a convention that name the result of express.Router() , simply router and not tourRouter(yes in the past, where we had
everything in one file, we had to name it based on the resource name, but now because everything are gonna be in separate files, we name it
router). Then export that router variable and then import it into our main application(app.js).
Important: So when we only have one thing to export, we use module.exports = <the thing we want to export>;

Now import the tourRouter and userRouter in app.js :
const tourRouter = require('.../tourRoutes'); WITHOUT the .js extension.

Now you might be wondering why I called the userRouter(so route and not routeS) but then the file we're importing is called
userRoutes(with s - plural), well, that's because that folder is called routes(plural) and so in there we have the tourRoutes and userRoutes.
But what we actually export from those files, is simply the router. But I believe it makes more sense to actually call that folder, routes and
so that's why we have that small difference between routes and router.

By separating routers into different files like tourRoutes.js and ... , now each of those files is one small sub application.
So one tour application and one user application and then we put everything together in our global app.js file by
importing the routers (like userRouter and ...) and then mounting those routers on different routes.
When you have sth like: app.use('route', <router(result of express.Router())>); , this is where we mount our router.

So we created different routers for each of different resources, to have a nice separation of concern between the resources. So basically creating
one small application for each of them and then putting everything together in one main app.js file.

Important: That app.js file is usually mainly used for middleware declarations. So we have all our middlewares that we want to apply to ALL
 of the routes and then also we have some middlewares that will apply for some specific routes only, in that main file.
For example, for the '/api/v1/tours' we want to apply the tourRouter middleware, therefore we wrote: app.use('route', <router>);
Learn: So tourRouter and ... are routers and also are middlewares and because of they're middleware, we can use app.use() in order to mount
 them.

After that we must cut the route handler functions from routes files and take them to controllers folder.
So let's create a new folder which is called controllers. Actually we're been calling them, route handlers and so it would make
sense to create a folder called handlers and not controllers. BUT later, we will start using a software architecture called
the model-view-controller and in that architecture (in MVC architecure), the route handler functions are called controllers.
So we put them in controller folder and in name of their file, we include the word 'controller'. So that's why we're gonna call that
folder 'controllers' and also the files in there would have the word 'controller' in them. So create tourController.js and ... .

Don't forget to add that snippet which is: const tours = JSON.parse(fs.readFileAsync(...));

Learn: In MVC structure, we start by receiving a request in app.js file, and then this request depending on the it's requested route
 (the resource that it wants), enters one of our routers and then depending on the requested route(url), the router will execute
 one of the controllers and that's where finally the response gets sent and finishing the request-response cycle.

Now we want to export all of those functions from that module(tourController and userController). How?
In this case, we don't have only one export, so we're not gonna use module.export = <the thing we want to export> , but instead,
we will put all of those functions(things we want to export), on the exports object.
So replace const keywords of those functions, with `exports.` . Then in tourRoutes, import them by saying:
const tourController = require('path to the tourController file');

Now remember that when we export data from a file by using the exports object, then when we import everything of that exported object into
one object, then all of the data that was on exports is now gonna be on the variable which is the result of requiring the external file(the
external files means the file that has the exports.<...> things.).
So in tourRouter.js , we will have tourController.getAllTours() instead of getAllTours() and ... . So in tourRoutes.js , the tourController
object is the equivalent of the exports that we have in tourController.js .

We could have also used destructuring, so these 2 lines are equal(IF the return statement of that require() is an object(so it means it
must exported MULTIPLE stuff)):
first approach: const tourController = require('...');
second approach: const {getAllTours, ...} = require('...');

Important: Inside {} , we specify the EXACT NAMES that we have in that required(imported) file.
and with destructuring, we can use those names DIRECTLY in our code, without having to write tourController.<the imported thing> .
But there's no problem of having it like the first approach. Because it makes it nicely visible that all of those imported functions
actually come from that tourController module(the imported file) - remember that the tourController is the name that we chose for that
imported module.

Important: Recap: The flow goes like this:
 We start receving the request in the app.js file. It will then depending on the route, enter one of the routers, so let's say the
 tourRouter and then depending, again, on that route and of the request, it will then execute one of those controllers in tourController file
 and that's where then finally, the response gets sent to consumer and finishing the request/response cycle.
So we now have 3 files, instead of having everything just in one file. But that's still not the end of the story, because I'm adding
one more step here. So what we're gonna do is to create a server.js file too and why we're doing that?

We create this file, because it's a good practice to have everything that is related to express, in one file (app.js) and then
everything that is related to the server in another main file(server.js).
So server.js will be our starting file where everything starts and it's there where we listen to our server.
So cut:
const port = ...;
app.listen(...);
and move it to server.js .
Now for using app in server.js we need to import it and to import it, we ned to first export it. So in app.js we use module.exports = app;

So now we have everything that is the application configuration in one standalone file.
Important: Later on, we will have other stuff in server.js , which those codes are not related to express, but still related to our application.
 Stuff like database configurations, or some error handling stuff, or environemnt variables, all of that stuff will live in server.js which is
 kind of our entry point.

When you have an OWN module, we need to use ./ to say that we're in the current folder.

Now we do no longer run nodemon app.js but instead nodemon server.js . So let's create an npm script for that. So create:
"start": "nodemon server.js" in package.json and you can use npm start to run it.

Currently even without having nodemon installed as our dev dependency, the npm start script which uses nodemon, works, because we have
nodemon installed globally. For install a package globally, use --global when installing the package. */
/* 64-18. Param Middleware:
Let's create a special type of middleware called param middleware.
Important: The param middleware only runs for certain parameters in URL. So basically when we have a certain parameter in our
 URL. For example :id.
So we can write a middleware that only runs when this :id parameter is present in the URL.

For writing a param middleware, we use the router variable(result of express.Router()) and then use the param method on that variable.
The first arg of param() is the parameter that we want to search for it in URL(so basically the parameter for which that middleware is gonna
run - without the colon, so just the name) and in the second arg, we specify our actual middleware function.
In param middleware and in it's second arg, we have access to FOURTH argument which is after next() argument and that one is the value
of parameter in question and we usually call this argument, val.
Learn: So in middleware the val parameter holds the value of the parameter in URL that we are looking for.
So we usually call that val. So the val parameter, is the one that will actually hold the the value of the specified parameter(the first arg
of that middleware function), in below example, the id parameter.
EX) router.param('id', (req, res, next, val) => {});

Also don't forget to call next() , because otherwise the request/response cycle will get stuck in that middleware function and it's not
gonna be able to move on to the next middleware in the stack.

Remember: This middleware will run if we have the id parameter in the requested URL.
If the route for tours doesn't have id parameter, this middleware would be ignored and the request would go to the next middleware in
middleware stack.

That param middleware function, will only run for that specified router(mini sub-application). So if you write a param middleware for
the router which is for tours resource, that param middleware will never run for users resource. So it will run ONLY for that
specified router(local mini application) which that router itself is for ONE resource.
Important: Again, each router is kind of a mini sub-application, one for each resource.
So if you write a param middleware on for example tourRouter, then of course, it is only part of the middleware stack if we are actually
inside of that sub-application, so if we are in tours resource.

Let's suppose we have an incoming request on /tours/:id. So that request will go through the app.js file, with our current middleware stack,
the order of middlewares that it will visit is:
- app.use(morgan('dev'));
- app.use(express.json());
- app.use((req, res, next) => {
  console.log('...');
  next();
});
- app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
- app.use('/api/v1/tours', tourRouter); (sine this is actually the route that the request has, it will then get into tourRouter middleware,
                                         so it goes to tourRouter.js)
-router.param('id', ...);  if the request had not an id param in it, this middleware will be ignored and it would move on to the next middleware
                           in the stack
-router.route('/:id')...

Now let's actually use that param middleware, Currently, in all of the handler functions that use the id param, in tourController.js,
we check if the id is valid. So all those 3 functions, have that similar code where they check if the id(which is a param in url) is valid and
if not, they send back that invalid id response.
So what we can do there, is to use the concept of param middleware and perform that check in an outside middleware that it's gonna run, BEFORE
the request even hits those handler functions. Important: So put router.param() , before the handler functions in tourRoutes.js .
So on TOP of all of those handler functions in tourController, create a new middleware function which is a param middleware and it's called,
checkId and of course we also need to export that and because it's a param middleware, the fourth argument, will be the value of the
parameter.
Important: Again, don't forget to call next() at the end of the middleware. Also the `return` statement in this middleware is crucial.
 Because if we didn't have that return there, well, then express would send that response back, but it would still continue running the
 code in this function and so after sending the response, it would then STILL hit that next() function and it would move on to the
 next middleware and would then send another response to the client. But that is not allowed.
We actually ran into this error before, where it told us that we were not allowed to send headers after the response had already been sent and
so that's the kind of error that we would run into, if we didn't that return statement inside this param middleware.
So again, that return statement makes sure that after sending this response(which is done by using res.status().json()), the function will
return, so that it will finish and if will never call that next() there. Now use tourRouter.checkId instead of that inline function
in tourRoutes for second arg of router.param();
Now you can remove the repeated code of checking the id param, in those handler functions of tourController.js .

So now this param middleware is now part of our pipeline(middleware stack).

EX) exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is : ${val}`);

    if (req.params.id * 1 > tours[tours.length - 1].id) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        });
    }

Now you might argue that we might simply create a simple function which could also check of the id and then call that function, inside of
each of those tour route handler functions, but that would go against the philosophy of express, where in philosophy of express, we should
always work with the middleware stack, so with that pipeline as much as we can and so those handler functions, they do not have to
worry at all about validation(so we shouldn't include ANY code related to validation or sth else, INSIDE those handler functions, we should
put those validation or ... code, in a separate middleware, before that handler function(why not after? because after those handler functions,
the request/response cycle would be ended!!!)). Each of those handler functions has only one purpose, which is to do what they say. For example,
in case of getTour() route handler function, it should ONLY gets the tour, createTour() only should create the tour and nothing else. So they
shouldn't do check, of they shouldn't have to worry about any of that.

Also if we would now add another controller for tours there which also depending on the id, well then that would AUTOMATICALLY also check if the
id is invalid, without us having to do any additional steps(calling that checkId() function which is a bad practice).

We MUST call next(), because otherwise the request-response cycle will get stuck in this middleware function (so it won't get to
controllers or route handler functions).
    next();
};

Remember: We chain multiple handlers, because we want to take all the logic that is not really conecerned with the route handler,
outside of that handler. So that route handler function is only concerned really with the work that is supposed to do.

router.param('id', tourController.checkID);

We create this function which is a param middleware, but for calling or using this middleware, we must call it in router.param() .
So we export this middleware and use it in tourRouter.js . Why use it in tourRouter.js?
Learn: Because for calling this special middleware, we need the router variable and that variable is in the routes file.So we need
 to export it.
We create this checkID middleware outside of route handler middlewares, so with this, the route handlers are only concerned about
getting, deleting and ... a tour. So for this task, we create a middleware before the route handler function.

The return statement here is very important.
because if we didn't have this return here, express would send the response back but because we didn't specify anything
to avoid to continue (return statement), it would still continue running the code in this function. So then it will call next()
so it would move on to the next middleware and then would send another response to the client. So we would get and error.
The error would be that we're not allowed to send headers after the response had already been sent.
So after sending the response, the function must return (finish), so it would never call next().

We no longer need this function, because from now on, we're gonna work with ids that are coming from mongodb and mongo itself
will give us error if we use an invalid id.
*/
/* 65-19. Chaining Multiple Middleware Functions:
Let's see how to chain multiple middleware functions for the same route. Up until this point, whenever we wanted to define
a middleware, we only ever passed one middleware function. For example, for handling a POST request, we only passed in that
tourController.createTour(), so we only passed in createTour() handler.
EX) router.route(...)
          .post(routerController.createTour)
and so that's the only function that is gonna be called, whenever we get a POST request. But let's now say, that we want to actually
run MULTIPLE MIDDLEWARE functions. Now you might ask: "Why would we want to do that?"
Well, we might for example, run a middleware, before that createTour, to actually check the data that is coming in the body. So a bit similar
to that checkId param middleware which we're using it, in order to check if the id is actually valid and doing that OUTSIDE of the actual
route handlers, so that they are only concerned with getting, updating or deleting a tour and so here, in this specific example with POST,
we might want to do the same thing. So as I said, we might want to check if request.body actually contains the data that we want for
the tour(if the body contains the name property for(so) the tour name and the price property) and if not, we want to send back a
400(stands for bad request) status code. 400 status code stands for bad request. So basically an invalid request from the client,
which is in this case trying to create a new tour without a name and without a price property. At the end, add this new middleware function
to POST handler stack of tourRouter . For adding that to POST middleware stack of POST of tourRouter, you simply add that function before
the createTour handler which will ultimately create the tour.(before, because we want to run it before!).
So we want to create our OWN middleware function.

So this way, when we have a POST request for that route('/'), it will then run that new middleware function first and only then, the creatTour() .
So that's how we chain two different middlewares. 

Now let's write that new middleware, after the checkId middleware which is in tourController.js .
When we have 400 status code, the status would be 'fail'. In checkBody middleware, we say that the name and price properties need to be
there at the same time. But if everything is correct, well, then we want to move on to the next middleware by calling next() and the
next middleware will be createTour() .

201 status code is for "created".

With multiple middlewares for the same route, we can check if a certain user is logged in or if he has the privileges, so the access rights to
even write a new tour or really all kinds of stuff that we want to happen before the tour is actually created and once again we do that,
because we want to take all the logic that is not really concerned with creating the new resource, outside of that handler. So that that handler,
is only concerned really with the work that it is supposed to do.

66-20. Serving Static Files:
Let's look at how to serve static files with express. Now what do I actually mean with static files?
Static file are the files that are sitting in our file system that we currently can't access
them using our routes. For example we have that overview.html file in our public folder, but right now there's no way that we can
access that using a browser. So, currently can't access overview.html (or anything is inside public folder) via browser.
Let me show this concept to you and for this, let's use the browser this time.

If you write: 127.0.0.1:3000/api/v1/tours (this is a GET request, because we're using browser), you get all the tours in unformatted way,
but let's say we actually want to access that overview.html file.

So if you write http://localhost:3000/public/overview.html , it won't work, because we didn't define any route for this url.So
we don't have any route handler that is associated to this route and so if we actually want to access sth from our file system, we
need to use a built-in express middleware.
Remember static files are like html files or images or css or js or ...
So if we want to access something from our file system, we need to use a built-in express middleware.

Now in this section, we're actually just talking about an API, so we don't actually need to serve static files like images or html, but
since this section is an introduction to express in general, the tutor also wanted to quickly show this content to us anyway.

So let's write this after app.use(express.json()); :
app.use(express.static());

In parentheses of static() function we pass in the directory that from which, we want to serve static files.
After using this middleware, if you visit that prior URL with a little difference in browser you can visit that static file.
So now the URL would be: http://localhost:3000/overview.html and it's not going to work with http://localhost:3000/public/overview.html url,
so without the /public part.
So without defining any routes and route handler functions we can visit these static files.

Now why is that? Why don't we need the /public folder in url?
Because when we open up a url, that it (the browser) can't find in any of our routes, it will then look in that public folder that we
defined and it kind of sets that folder to the root.So let's pretend that the root(localhost:3000) is now our public folder and then the overview.html
is in there, so that's why we have access to it. So when we have: http://localhost:3000/overview.html , the localhost:3000 is kinda our
public folder, therefore the overview.html is right there, so that's why we can access overview.html with this url in browser. For seeing
an image in img folder, we can do that by using: localhost:3000/img/pin.png
But if you write http://localhost:3000/img/ , it will throw an error: cannot GET /img/. Because this is not a file,
this looks like a regular route and so express tries to find a route handler function for this URL, but it can't. Because you
didn't define any ROUTE HANDLER for this url. So really it just works for static files, in which case, it will, again,
not go into any route, but simply serve that file that we specified from the public folder or in the folder that we specified in ()
of that express.static() .
So when a user looks for a static file, express won't go into a new route, but simply serve that file that we specified in the
folder in middleware.
So with this middleware, we served static files from a folder and not from a route.

Currently, the images in 127.0.0.1:3000/overview.html are broken and that's because that html is not supposed to be server like that. We're
just using it now, so that we get some visual feedback.
Currently, you can see we had a bunch of logs for all the requests that were done, for all of the assets. So as I said right in the beginning,
for each peiece that is part of the website, our server actually gets a SEPARATE request and currently, you see that most of them get
that 404 status in logs. So that's why the links are broken on the web page currently. It's simply because express can't find them in
that folder(so when we type 127.0.0.1/3000/overview.html , yes, we request for overview.html , but that page also has some images and other
stuff. So the server gets separate reqs for those images and other stuff like css and other static files that were used in that overview.html which
those stuff are in /public folder, as well. But because their links are broken, the logs for them would be 404).

So for each piece that is part of the website, our server actually gets a separate req and you see currently, most of them causes the log to
be 404, so that's why the links for images are then broken on the web page we receive on browser. Simply because express cannot find them in
this folder.
So what tutor wanted to show us is how we can serve static files from a folder and not from a route.*/
/* 67-21. Environment Variables:
What are env variables? How we set them and how we use them?
This is not exactly about express, it really has to do with nodejs development in general.
node.js or express apps can run in different environments and the most crucial ones are the development environment and the
production environment. That's because, depending on environment, we might use different databases for example, or we might turn login on or off,
or we might turn debugging on or off or really all kinds of different settings that might change, depending on the development(environment!!!,
the tutor was incorrect!) that we're in.

So again, the most crucial ones are the development and the production environment. But there are other environments that bigger
teams might use. So these type of settings(factors) that I just mentioned, like different dbs or login turned or on or off, are based on
environment variables.
Now, By default, express sets the environment, to development, which makes sense because that's what we're doing when we start a new project.

Important: Everything that is not related to express, we're gonna do it outside of app.js . So app.js is only for configuring our (express)
 application(everything that has to do with express app). But the env variables are outside the scope of express.
So we should write them outside of app.js and in server.js .

Learn: You can see the environment that you are currently in by using: console.log(app.get('env')); so app.get('env') will get us
 the 'env' environment variable.
 In summary, environment variables are global variables that are used to define the envrionement, in which a node app is running.
The 'env' environment variable is set by express, but node itself actually sets a lot of environments. But 'env' variable
is set by EXPRESS and not nodejs, but node itself actually ALSO sets a lot of environment variables and node uses most of them, internally and they're
located at: process.env and those env variables in node, are coming from process core module and there's no need to require process module.
So it is available everywhere.
Learn: Environment variables of nodejs itself, can be get, by using process.env which will give us a bunch of different variables and node
 uses them, internally.
For example, it has the current working directory in PWD environment variable. Other examples: Your home folder is at HOME env variable and
your login name is at LOGNAME, the script that we use to start this process is specified at npm_lifecycle_script which currently is set to:
'nodemon server.js' . In other words, the value of npm_lifecycle_script is 'nodemon server.js' , so really, a bunch of stuff that
for some reason, nodejs internally needs. Those variables come from the process core module and we're set at the moment that the process
started and as you see, we didn't even have to require the process module. It is simply available everywhere AUTOMATICALLY.

Now in express, many packages depend on a special variable called NODE_ENV.It's a variable that's kind of a convention, which
should define whether we're in development or in production mode.However, express doesn't really define this variable and so we have to do that
manually and there are multiple ways in which we can do it, but let's start with the easiest one which is to use the terminal.
For running nodemon server.js , we did it using npm start, so npm start, in turn, in this case, stands for: nodemon server.js . So
we use nodemon server.js to start the process, but if you want to set an environment variable for this process like nodemon server.js ,
we need to prepend that variable(NODE_ENV) to the process command.
So we say: NODE_ENV=development nodemon server.js . Now if you start that process, the NODE_ENV is set to development, so we would have:
NODE_ENV: 'development', (which we observed this, by logging the process.env to the console). Therefore, that variable(NODE_ENV)
that we have in console.log(process.env), actually comes from that command and we can actually define even more if we wanted.
Now you can create and set even more environment variables. So we can say:
NODE_ENV=development X=23 nodemon server.js , then start the process and now by logging the process.env , you now see the `X` environment
variable is set to 23 string(so currently one of the results of logging of process.env is: X: '23').

So again, many packages on npm that we use for express development, actually depend on this environment variable and so when our project
is ready and we are gonna deploy it, we then should change the NODE_ENV variable to production and we will do that of course once we
deploy the project by the end of the course.

So we set NODE_ENV and X as env variables, but we can do a lot more and that's because we usually use env variables like configuration settings
for our application.

Important: In windows for setting an env variable you must say: SET <name of env variable-like NODE_ENV> = <value>
 So for doing the prior task we can say: SET X=24 and hit enter, and then say: npm run start or nodemon server.js .Because
 windows can't run multiple commands at the same time without specifying anything. (In windows if you want to run multiple commands
 on a single enter, you must write & or && between them between each command.)
Learn: Many packages on npm that we use for express development, depend on this env variable and so when our project is ready and
 we're gonna deploy it, we should change the NODE_ENV env variable to deployment.
So environment variables are global variables that are used to define environment in which node app is running.
Important: So whenever our app needs some configuration for stuff that might change based on the environment that the app is running in,
 we use env variables.For example, we might use different databases for development and for testing, so we could define one env
 variable for each and then activate the right database according to the env. Also we could set sensitive data like passwords and username,
 using env variables. Now it's not really good or practical to always define all of these variables in the command, where we start the
 application.
In other words, it's not good to always define them when we're running commands in command line. So imagine we had like, 10 env variables
and it would be not really practical to having to write them out ALL there, inside of that command(before the script we wanna use)
and so instead, what we do, is we can create a configuration file.
So create config.env and env , is really the convention for defining a file which has those env variables.
Remember: The env variable names must be upper case (convention).
Also install dotenv extension for vscode.
Let's also define the port, on which our app should be running, so that's also kind of a standard variable that is usually in a .env file.

Now how connect the .env file with our node app? So we need some way of reading those variables from that file and then saving them
as env variables. Because right now, that .env file is just a text file and node.js has no way of knowing that those variables are in that file.
For that, the standard is kind of using dotenv package from npm and then in server.js we require that package (Why in server?
Because it has nothing to do with express so we don't require it in app.js)
The below code, will read the env variables that are in .env file and save them in node.js environment variables (so they would be in
process.env).
In () of config(), we just have to pass an object, to specify the path where our configuration file is located and so what this line will now
do, is to read our variables(env variables) from the file and save them into nodejs env variables.
dotenv.config({ path: "./config.env" });

Now if you run: npm start and that should then log all our environment variables to the console, because in our code we
have: console.log(process.env) and now you can see that we have:
NODE_ENV='development'
PORT='8000'
USERNAME='...' (we called this USERNAME and not USER, because we ALREADY have an env variable in process.env which is called USER)
PASSWORD='...'
So that dotenv.config(...); has load all the env variables from that file and add them to process.env variables.

Remember: After changing the env variables you need to re-run the server again(by saving the server.js or ...),

in the end of that logged data we can see our OWN env variables and their values.
After this, we must use these variables in our code, like app.js file. In app.js , I only want to run that logger middleware, so to
only define it, when we are actually in development. So that the logging, does not happen when the app is in production. So we need to
check for process.env.NODE_ENV and if it was in 'development', only then we want to use morgan.
Our logger middleware is define where we have: app.use(morgan('dev'));

You might ask why we actually have access to the NODE_ENV env variable when we didn't really define them in the file that we're using
them(like app.js), but in server.js(because we wrote the dotenv.config() in server.js and not other files) . So how it is possible?
The answer to that, is that the reading of the variables from .env file which that reading operation happens at server.js and save
it to the node process, only needs to HAPPEN ONCE. After that those variables that were read, are in the process and process is available
and it's the same, no matter which file we're currently in. So we're always in the same process(process variable is the same in all files) and
the env variables are on the process and so the process that is running, so where our application is running, is always the same and so that
process.env.NODE_ENV is available to us in every single file in the project. So this is how we use that NODE_ENV variable.
Important: The next if statement and other codes like that are codes that run based on the environment of our application
if (process.env.NODE_ENV === 'sth') {}.

Now in server.js we say that the port should either be the one coming from the environment variables or that 3000 .

If you get an error that says:
Error: listen EADDRINSUSE:: <port number>, when running a node app, it means we're already using that 8000 in some other apps that's
running somewhere on our computer and so we need to change that in config.env (of course, IF you have that number which is in use,
in config.env). For example, the tutor got this error and he changes the PORT env variable in config.env from 8000 to 3000 .

We can get rid of that console.log(process.env.NODE_ENV);

Currently, we get undefined for value of process.env.NODE_ENV in app.js . Because we require() the './app' file BEFORE our env variables
are read from the config file and so the operation of reading the env variables from config.env file, needs to be BEFORE requiring ./app file.
So only AFTER reading the dotenv variables, we want to run the code that is in app.js file.
So again, we couldn't read the process variable, inside app.js because it(the env variables) wasn't yet configured. Now if you send a request,
the logger middleware would be run, because we're in development env.

Important: First we have to read or configure the .env file in our project and THEN use any file that is using process.env.<name of env
 variable>. So because the server is first running server.js , first we have to configure dotenv file and then require any other
 files that are using process.env.<...> .
So the dotenv.config(); line should happen before requiring any other file in server.js .
So the problem was we actually require the app file(const app = require('./app')); BEFORE our env variables are read from the config file. But it
needs to be the other way around. So dotenv.config() should be BEFORE requiring that app file and other require() lines of our project files. So
only after that dotenv.config() , we wanna run the code of app.js file and other files.

Let's add a new start script to our package.json . Right now we have: "start": "nodemon server.js" , but we also want to add another one for
production, just so that we can test what happens in that situation. So create: start:prod script and also let's rename the old "start" one,
to: start:dev .
In production, we simply want to set the NODE_ENV variable to production. So for actual command of that npm script we say:
NODE_ENV=production and then the rest of the npm script. So our npm start:prod script which is ONLY for testing purposes is now:
NODE_ENV=production nodemon server.js . (it's only for test, because we only want to have a npm script which sets NODE_ENV to production
to see the behavior of app in that environment.).
Now if you console.log(process.env.NODE_ENV); , you will get production as logged message and if we send a request, we will then NOT
execute the logger middleware.

So this is how we run different code, depending whether we're in development or in production.

Now let's go back to our development script of course! */
/* 68-22. Setting up ESLint + Prettier in VS Code:
es-lint is a program that constantly scans our code and find potential coding errors or bad coding practices that it thinks are wrong and
it's very configurable.
We can also use es-lint for code formatting, but we will continue using prettier for that. So we will setup this entire thing, so that
prettier is still the main code formatter but based on some es-lint rules that we will define and so all that es-lint will do for us,
is to highlight the errors.

First install es-lint and prettier extention for vscode. Now we need to install a bunch of dev deps.
We need to also install eslint and prettier as npm packages as well(as dev dep):

So the recipe for prettier and eslint is:
npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb
eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev

eslint-config-prettier will disable formatting for eslint, because remember, we want prettier to format our code and not eslint.
So with this package, prettier will take care of formatting and not eslint.

eslint-plugin-prettier package will allow eslint to show formatting errors as we type using prettier.

For future projects, all you have to do is to go to package.json of this project and copy the deps and install them in your next project. Why?
Because all of these packages must installed locally on the project and not globally. So it would not work if we tried to do this globally.

Now we need some js style guides that we can follow, airbnb style guide for javascript is very good and actually, there is an eslint configuration
that we can use for that, which is on npm and it's called eslint-config-airbnb .

eslint-plugin-node will add a couple of specific eslint rules only for nodejs. (For finding some errors that we might be doing when writing node.js
code.)
Now finally, we need 3 other eslint plugins which are only neccessary in order to make the airbnb style guide actually work.
So that style guide kind of depends on these 3:
eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
So even though we're not writing react code here, we still need this one, because the airbnb style guide depends on it.
We need to save all of these packages as dev dependency.

Next we need config files for both prettier and eslint(we already created the one for prettier and the one for eslint is already in the
starter files).

In .eslintrc.json and in extends property, we say we want to use the airbnb style guide and also prettier and also the
node plugin("plugin:node/recommended").

es-lint is all about coding rules and there are many many rules that es-lint tries to enforce on us, but we can actually change the ones
that we want to use, one by one and we can wether turn them off completely or just showing a warning instead of showing an error.
For example one rule is that es-lint does not want us to use console.log() s in our code which is specified by the "no-console" property and
so each time by default, it will give us an error when we use console.log() , but instead of showing me an error, we configure it, so that it
only shows me a warning. So we set the value of "no-console" property to "warn". We could also completely turn it off, by writing "off" as it's
value.

In "consistent-return", it forces us that each and every function should always return sth, but sometimes we have a function which doesn't,
so we turned it off.

For "no-unused-vars", we leave it as "error" but we ALSO created some EXCEPTIONS by specifying an object as second element of array we specified
as value of "no-unused-vars" and we specified 4 exceptions which are the typical variables that we have in express(in handlers in express), but that
we don't always use them. So we don't want them to be marked as errors each time that for example I have a "req" as variable name in a function,
but I don't use it.

If after specifying the rules for es-lint the errors don't show up in code, close the editor and re-opens it.
You can see the errors in code in PROBLEMS tab of terminal in vscode.*/






/* Important: We created appError class in order to create the errors with that custom class. Which that class has some properties
    which are very custom like isOperational property. So we created this class because for example isOperational property doesn't
    exist in Error built-in class. So this class is some kind of error constructor for us that we can produce our own errors with the
    help of that class.
    But we created an anonymous function in catchAsync file to actually have a common catch error place for all of our handler functions
    instead of writing one catch block for each handler function, we simply create a function that do this catching error responsibility
    which it's job is first execute the route handler function then catch the error(if there is an error!) and then send that error
    to our global error handler middleware by calling next(err) .
    Remember: These route handler functions would called based on the route that the user requested.

Remember: You MUST give each of the route handlers that are giving them to catchAsync function, next arg. Because it's true that
maybe we don't use next arg inside the function itself but in catchAsync function we definitly need to call next(err) if there's an
error, so we must pass next to all of the route handler functions. */

/* Remember: We can execute some code even after sending back the response to the client (we can't send 2 responses for one
request, obviously!), but if you want to say: I don't want to execute further code in a function, say: return; */
