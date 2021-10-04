/* SECTION 7. Introduction to MongoDB:
69-1. Section Intro:
This section is all about the popular mongodb database system. You'll look at how to install mongodb on your system, how to create
databases, how to then insert data into a db, query data in multiple ways and ... .

70-2. What is MongoDB:
- mongodb: an overview:
In mongo, each db can contain one or more collections(tables). You can think of a collection as a table of data. Then, each collection can
contain one or more data structures called, documents(rows in sql dbs) and again, in a relational db, a document would be a row in a table.
Important: So each document contains the data about one single entity. For example, one blog post or one user or one review(an entity) or ... .
 The collection is like the parent structure that CONTAIN all those entities. For example, a blog collection for all posts, a users collection
 or a reviews collection.
The document has a data format that looks a lot like JSON which will make our work a lot easier when we start dealing with those documents.

Database      ---> collections  ---> documents
Mongodb             ("tables")         ("rows")

nosql                   blog --------> post
                        users --------> user
                        reviews ------> review

- What is mongodb?
Mongodb is a document db with the scalability and flexibility that you want and with the querying and indexing that you need.

- key mongodb features:
1) Document based: Mongodb is a document-based database, so it stores data in documents which are field-value paired data structures like JSON.
So again, it stores data in those document instead of rows in a table like in traditional relational db. It's therefore a nosql
db and not a relational one.

2) Scalable: Mongodb has built-in scalability, making it easy to distribute data across multiple machines, as your apps get more and more users and
starts generating a ton of data. So whatever you do, mongodb will make it easy for you to grow.

3) Flexible: There is no need to define a document data schema before filling it with data. Meaning that each document can have a different number
and type of fields and we can also change these fields all the time.
So: No document data schema required, so each document can have different number and type of fields.

4) Performant: Mongodb is a very performant database system thanks to features like embedded data models, indexing, sharding, the flexible
documents that we already talked about, native duplication and ... .

5) Free and open source db, published under the SSPL license.

- Documents, BSON and embedding:
Mongodb uses a data format similar to JSON for data storage, called BSON. It looks basically the same as JSON, but it's typed, meaning that all values
will have a data type such as string, boolean, date, integer, double, object and ... . So what this means, is that all mongodb docs will
be typed which is different from JSON.

EX) mongodb doc:
{
  "_id": ObjectID('12323232323232323'),
  "title": "....",
  "published": true,
  tags: ['', '', ''],
  "comments": [
    {"author": "", "text": ""},   |
    {"author": "", "text": ""},   | embedded docs
    {"author": "", "text": ""},   |
  ]
}

Mongodb docs are flexible, because for example we can have an array, so multiple values for ONE field. But in relational dbs, that's not realy
allowed. We can not have multiple values in one field and so we would have to find workarounds for this.

Embedded docs in mongo: This feature is not present in relational dbs. For example in comments field, we have an array which contains three
objects, one for each document and each of them could be it's OWN document. So imagine, we had a comments collection which contained a bunch of
comment docs and each of them could look like the objects we have for "comments" field. But instead of doing that, we include those comments
RIGHT INTO the blog post document. So in other words, we embed the comment docs right into the post doc.
So this process of embedding or de-normalizing, is basically to include(embed), some related data all into one SINGLE doc.
In this example, the comments are related to the post and so they are included in the SAME doc and this makes a db more performant in some
situations, because this way, it can be easier to read all the data that we need all at once(this concept is related to data modeling).

The opposite of embedding or de-normalizing, is normalizing and that's how the data is always modeled in relational dbs. So in that case,
it's not possible to embed data and the solution is to create a whole new table for the comments and then join the tables by referencing
to the id field of the comments table.

Two things about BSON docs:
- The maximum size for each doc is currently 16Mb,
- Each doc contains a unique _id which acts as primary key of that doc and is automatically generated with the ObjectID data type, each time there
is a new doc and so we don't have to worry about it.

71-3. Installing MongoDB on macOS:
In mongodb.com go to products and then the mongodb server. Now we want the mongodb community server.

Mongodb atlas which is mongo's database as a service. So basically it's running mongodb in the cloud on atlas, instead of running it locally
and actually later in this section, that is exactly what we're gonna do. So we will create an atlas account and run our db in the cloud.
In this video, we're installing the local version of mongodb which we will use to get fimiliar with the database system. But then, by the
end of the section, we will actually transition to the hosted version and that's the one we will then use in our real app, until the
end of the course.

When you extracted the downloaded file, what we want is to look at the files inside bin folder and what we want need there, is basically
those executable files and what we need to do with them, is to copy them into a special binary folder that we have on our system.
So in terminal, do a copy command and we're gonna need some permissions for that, so start with sudo. Then write cp which stands for copy
and then drag all of those executable files which are inside bin folder of downloaded file. Why drag them?
Because we don't want to write the path to them out and after that, you can see all of the files that we're gonna copy and we will copy them into
a folder called /usr/local/bin and just to make sure it's done correctly, let's go to that path(so use cd command) and then use the ls command.
The red files are the ones that we just(recently) copied there. So those are the executables.

In that folder(/usr/local/bin), you can also see the nodemon command(file) there. That is the global nodemon package that we actually installed
before. I mean, it's not really the package itself, but it is that what allows us to run the `nodemon` command globally.
Next, we're gonna create a folder where the database can then actually store the data and again, we're gonna need permissions for that
so run this command in that /usr/local/bin:
sudo mkdir /data/db .
Next we need to give some permissions in order for the database to be able to WRITE in that folder and so for that, again, we use sudo and then
chown and -R for recursive then: `id -un` /data/db
So: sudo chown -R `id -un` /data/db .

Now you would be able to call mongod in terminal and we now have the mongo process, running there and by the end of that text, it tells
us that it's waiting for connections on port 27017. So that there, is basically like a mongo server and this means, that mongodb is now
running in the background, but we need to now actually connect to it, in order to create new databases and create new collections and
all that good stuff. So in that terminal window, we will leave that process running. so leave that mongodb server running and we then open
ANOTHER tab(window).
You can use cmd + t to open another tab and now we run the mongo shell, simply by writing `mongo` and so we are now connected to our
mongodb server that is running on localhost and on default port(27017). So we're now connected to that and so let's now write `db` there,
which should return the test database.
So we have a test db already on our computer and so this means that it works.

We could have used that mongo shell to also connect to a remote db. So remember how in the beginning, I talked about the mongodb atlas? which is
basically a database running in the(a) cloud. So a remote db and we can use mongodb shell to also connect to that one. But if we
simply run the mongo command like what we did there, it will just automatically connect to the local mongodb db that is running on localhost.

Now let's create our first new database and start to interact a bit more with that mongo shell.

72-4. Installing MongoDB on Windows: TODO: need re-watch!
After installing the mongodb app, you need to create a directory which mongo will store our data into that directory.
So go to c drive, and there create a folder named data and in there create folder
called db which in this db directory, mongol will store our databases.
In bin directory we have mongod.exe file which is the server. So you must open this file using powershell to start the server.
So we say .\mongod.exe in bin directory and then the server is running.(Remember before running the server you must create those
folders in root of c drive.)
Now the server would waiting for connections on port 27017. Now we need a shell to connect to server in order to be able to
manipulate our databases (create database add document and ...). So open a new terminal and go to bin directory, Now you must run
mono.exe file.Now you are connected to the same port. Now if you run db command, you would get the test database in result.
So in one terminal we're running the server and in another terminal you're connected to server.

Now what if you want to run the mongod.exe program from another directory?
So for example from users directory? So if in users directory you type mongod.exe, it won't work. Because windows doesn't know
where to look for mongod.exe file. So windows thinks this file should be in Parsa directory, but it isn't.
So we need to find a way to tell windows to look for this file and find it in that bin directory
Learn: so basically we want a way to run that file if we are not in the directory that file lives. So we must use SYSTEM VARIABLES.
 So go to settings and search for env and go to 'edit system environment variables'. Now you are in system properties then click on
 advanced tab and click on environment variables. Now look into system variables box and then on Path variable click edit,
 now you can see there is a couple of paths added there. So if you add a path to a program, you can run that program anywhere
 you want.Now add the path to bin directory of mongodb there.
 Basically we add the absolute path to the folder where the program lives in that folder.
Now after closing the old terminal and open a new one, if you run the mongod.exe server file from anywhere, it would run!
Now you can run mongodb commands from anywhere on your system.*/
/* 73-5. Creating a Local Database
Let's create our first local db, using the mongo shell. That terminal application which is the mongo shell, works exactly the same on
windows and mac.
Currently, in a separate terminal tab we should have our mongo server running in the background on that port(27017) and so let's open up
the mongo shell. So remember for using mongo shell, we just type mongo and that will then open up the mongo shell.
Then cmd + k to clear the terminal and now let's create our first db and to do that, we write "use <name of db that we want to create>" command.
Note: The "use <name of db>" is also used to SWITCH to an already existing db, but if we try to basically switch to a db that doesn't
yet exist, it will then create a new one with that name. So if that db doesn't exist, it will create that db and ALSO switch to it.
Remember that inside a db, we have collections and then each collection has documents in it and the data that we create in the mongo shell,
is always documents and so of course we have to create the document inside of a collection and so we specify that collection, BEFORE we insert
a document.
Important: In mongo shell, db stands for current database(the database that we used "use" to switch to it).

Let's create a database with mongo shell. So first you must run mongo server running in background (use mongod.exe to run server),
and now we can type: mongo to open up mongo shell.
For creating a database inside mongo shell, type: use <the name of database>
Learn:Also you can use use command to go to an existing database (if that database already exists), but if that database
 doesn't exist it would create the database with given name after use command.
Now after creating database, it would create the database and then switch to it.Now you must create documents, but first you need
to specify the collection before insert a document and also remember in mongo shell, db command stands for current database .
So `db` is the currently used database that is right now active and when we want to insert a document into it, we need to specify the
collection where that document is gonna live and we do that by using: db.<name of the collection where that document is gonna live>.insertMany() .
If that collection doesn't exist yet or hasn't been created, it will create it once we run this command.
We would have a collection for each resource that we have in our app. But don't worry about that, we will talk about data modelling, later
in the course.

So for inserting, say: db.<name of collection>.insertMany() .
We can pass a js object to insertMany() and it will then convert it into JSON and BSON.
We could also use quotes on the property names, but it is optional.

If the collection that you want to insert document in it, doesn't exist, it will first create it and then insert doc into it, using
the prior command.
Remember: We would have collections for each resources we have.
Remember that mongodb uses BSON, which is quite similar to JSON.
Now pass a JS object into insertOne() function and it will then converted to JSON and BSON which is quite similar to JSON and so we can
actually simply pass a JS object into that insertMany() function and it will then convert it into JSON and BSON.
You could also use quotes(double quotes - because we're in context of JSON) on the property names, but it's optional(because it's a regular
JS object).

If you're only inserting one document into collection, you need to use insertOne() and not insertMany(). So we use insertMany() to create
multiple documents and we use insertOne() when we just wanna create one.

Important: If you want to use quotes in JS object that would converted to JSON, it's better to use double quotes and not single quotes.
 But anyways, the single quotes will converted to double ones.

Learn: Mongodb will create unique _id identifiers behind the scenes, when we insert a new document.
After creating a document and use then query it, you see that it also automatically uses double quotes.
So when you create a new document, it also automatically creates: "_id": ObjectId("...") and ObjectId() is the unique identifier of that
document. So mongodb would automatically create those unique identifiers behind the scenes.
Documents are just regular JSON objects and so this makes it easy to work with JS, so this is gonna make it really easy to work with mongodb
data in JS. Because we're already using kind of the same format that we're already used to in JS and so that is one of the main reasons
why mongodb is so popular for nodejs apps.

The `show dbs` commands will show all the dbs that we have in mongodb. By default, we have admin, config and local dbs too, which mongodb
automatically creates them for us and yours, might not be the same as these three and we can use the `use` command to switch to one of
them or to create a new db.

Again, `use` command is to switch to an existing database or to create a new one, if the name that we pass into it, does not yet exist.

The `show collections` command is to list the collections of a db.
Remember: When you created the document that it's collection didn't yet exist, it also creates that collection, because every document always
has to be inside of a collection.

So these were the basic commands of mongo shell.

So if you doesn't have a collection that you are inserting documents in it, it would create the collection and then insert those
docs inside that collection.

We have also the show collection command.
quit() for quitting mongo shell.
insertMany() will accept an array of multiple objects and each object is a document in the collection.For example:
db.tours.insertMany([{...}, {...}, {...}])

Remember: For running mongo shell just type: mongo

Learn: db.<name of collection>.find() will list all of the documents in the specified collection.*/
/* 73-6. CRUD Creating Documents:
Maybe you're wondering why are we actually doing all this stuff in a terminal? and how does this relate to our express application?
Because we want to look at the absolute fundamentals of mongodb, without the context of any application. So really, completely outside
of nodejs. Because in theory, we could use mongodb with any other language or any other framework, it doesn't have to be with nodejs and
so it's a good idea to look at mongodb, standing completely on it's own, without the context of any other language. Later on, we will connect
a mongodb db with our app, so that we can then actually start working with dbs inside of our express app and by then, we will use
a mongodb driver, just for node express, so that we can use our JS language to interact with our mongodb database.
But for now, let's just look at mongodb without any of that.

Now let's create two docs at the same time. So we use insertMany() .
insertMany() is gonna accept an array of multiple objects.

Mongodb documents are very flexible and they do not all have to have the same structure. So we can have different fields in
different documents. So in this case, we added the difficulty field in second object(which represents a document) and as you can see,
the first object doesn't have that field at all! But because mongodb docs are very flexible, some docs can have some fields that other
docs even don't have those fields!
After hitting enter, you see the IDs that they got. So two auto-generated, unique identifiers for each of those docs.

EX) db.tours.insertMany([{name: "...", ...}, {name: "...", ..., difficulty: "easy"}]);

Then run: db.tours.find()

Let's do some advanced queries to search for data in our db.

74-7. CRUD Querying (Reading) Documents:
Let's look at a couple of query operators in mongodb.

Querying (reading) documents:
The easiest way to basically query for ALL the documents in a certain collection, is to just use find() without passing anything in () of
it and it gives us all the docs that are in that certain collection, without any searching criteria.
But now let's say we actually only want one tour and we already know it's name and so we can search for that tour, using the name(a field) that
we know. So we need to pass in a filter object to .find() . So inside that object, we pass in the filter or the search criteria that we want
to search for. So in this case, we simply set the name to the tour name that we want to search for.
EX) db.tours.find({name: "The Forest Hiker"});

So this is our search criteria or the search filter and if we hit return, we get the tour where it's name matches exactly the one that we
passed in. This was the easiest way that we can search for documents. Now let's use some special query operators.

In mongodb, everything works with objects.

Let's search for tours which have a price below 500. For this, like always, first we use: db.<collection name>.find() and then pass the filter
object to () of find() . So we want all the tours with price below 500 , so we need to use the less than or equal operator. For this, we need to
define, yet a new object, where we set the $lte property to 500.
This is how we use query operators in mongodb. $lte stands for less than equal and that is what we're searching for, where the price is less than
or equal to 500.
The $ sign is reserved in mongodb for it's operators. So whenever you see that dollar sign in mongodb, for it's operators. So whenever
you see that $ in mongodb, you know that it's a mongo operator. So the weirdest part here is probably, that we have to do it inside a NEW
OBJECT, but if you think about it, it's actually really the only way to specify that the price should not simply be 500, but sth else.
So we have to set the price to sth else than 500(because we don't want the tours that have exact 500 as their price property) and the
best way really, is to just use another object in there. So that's exactly how mongodb then works and by running that, we get docs where
the price property is below 500.

EX) db.tours.find({price: {$lte: 500}});

Let's search for two search criteria at the same time.

$lte stands for: less than OR equal.

EX) Search for documents, which have the price less or equal than 500, but also at the same time, the rating greater or equal to 4.8 .
db.tours.find({price: {$lt: 500}, rating: {$gte: 4.8}});

Important: When you put multiple properties of documents you're looking for, one after the another(which those search fields are separated by
 comma), you're performing an AND operation.
 So in above example, we get the docs where the BOTH search criteria are true at the same time(why at the same time? because we're performing an
 AND operation).

For recap, when we want to search for two criteria at the same time, which basically is an AND query, well, the only thing that we have to do is
to specify the fields in the filter object and that would be simply an AND operation without any further hassle!

db.tours.find({ price: {$gt: 2000}, rating: {$lte: 3.2} }) : means: give docs in tours collection where price is greater than to 2000 AND
rating is greater than or equal to 3.2 .

So an AND query is querying for docs where those conditions(which are specified as values(the value can be an exact value or an object)
of properties) are ALL TRUE, but now let's do an OR query. So basically, searching for all the docs where EITHER AT LEAST ONE PART is true.
Learn: For value of $or operator, we specify an array and we put the conditions of that $or operation, in that array.

                              First condition    Second condition(filter)
EX) db.tours.find({ $or: [ {price: {$lt: 500}}, {rating: {$gte: 4.8}}  ] })
So we start by $or mongo operator and this operator accepts an array of conditions, which each condition(filter) is an object or possibly a
primitive value.
So the array we pass to $or, will contain one object for each of our filters.
So in this example we have 2 conditions that for each document we search it's price and each rating and if ONE OF THEM (because
we have $or operator) WAS TRUE based on condition, the doc will added to results.

Besides the filter object (the object that has $or and our conditions ...), we can pass in the projection object(we can also pass in
an object, for projection).
Learn: So what projection means, is that we simply want to select some of the fields in the output

In projection object we specify what fields we want in the results output. So in that object we specify
the name of the field that we want to be in the results and set it to 1 and other fields won't be in the results.

db.tours.find(<conditions>, <projection>);
EX) db.tours.find({$or: [ {price: {...}, ...} ]}, {name: 1});

In above example, the name: 1 in projection, means that we only want the name to be in the output and so that's why we set name to 1 and all
the others, are not gonna appear in this case(in the output). Also remember, the _id would also be included in the output anyway. So the _id
field of docs, is always there, there's no way of removing that.

So this was how we query in mongodb and some mongodb operators.  */
/* 75-8. CRUD Updating Documents:
In mongo shell write:
db.tours.updateOne({name: "..."}, {$set: {price: 597}});

Updating docs: How updateMany() works?
First we need to select which docs we want to update and second we need to pass in the data that should be updated. So the
first arg is basically a filter object, so we basically need to query for the documents that we want to update(so first we need to
select them with a filter object and then update them with new data which is the second arg).

In the second arg, we pass in an object that indicates, what I actually want to update and in that object we specify the $set operator
which has a value of an object and in that object we specify the fields that we want to update and their values.
So for $set, we need to create yet another object.
In the above example, we want to set the price to 597.

So for second arg, we need to use the $set operator. So again, this works using operators just like in those complex queries that we saw
in the last vid.

For $set, we pass in yet another object and in that object we specify the property that we want to update and the value we want to set it to.
ex)
db.tours.updateOne({name: "..."}, { $set: {price: 597} });

Remember: If you were using updateOne() and the filter object result would return more than one doc(in other words, match MULTIPLE docs),
then ONLY THE FIRST DOC WOULD BE UPDATED, because you are using updateOne() instead of updateMany() .
In other words if that first arg of updateOne() which is a filter object, would have selected MULTIPLE docs, then only the FIRST one would
have been updated to values that we specify in the second arg of updateOne() , because we were using updateOne() and so if we already
know beforehand, that our query is gonna match multiple docs, then we should use updateMany() and not updateOne() .

With the above example, we updated a property that ALREADY existed, so the price property was already there and we simply updated it(set it to
a new value), but we can also CREATE NEW PROPERTIES and set them to new values! So with updateOne() or updateMany() we can also create NEW
properties for the selected docs.

If you update a field that doesn't currently exist in the documents that you want update, it will create those fields.
So let's see an example that we're creating a new field(`premium` field) and we set it to true, with updateMany():
EX) db.tours.updateMany({{price: {$gt: 500}}, {rating: {$gte: 4.8}}}, { $set: {premium: true} })

Then, for checking the updated tour, you can use: db.tours.find() to see the affected doc.

Remember that with updateMany(), if there were multiple docs matching that query, then all of them would have gotten that new field.

With .updateOne() or .updateMany() we usually only update PARTS of the document or documents, but we can also completely replace
the content of a document with .replaceOne() and for multiple docs, .replaceMany() which like 2 prior functions, for first arg,
gets the filter object (search query) and for second arg, pass the new data which is in an object for $set and that second arg in this case,
is the new data that you want to put in the document(s).

76-9. CRUD Deleting Documents:
Just like before, deleteOne() will only work for the first document matching your query and deleteMany() , will work for all the docs, matching
your query(the first arg).

EX) Delete all the tours which have a rating less than 4.8:
db.tours.deleteMany({rating: {$lt: 4.8}});
                    |                  |
                         condition

After running this command, it would tell us how many docs were affected by that operation.

If you want to delete all of the docs inside a collection:
db.<name of collection>.deleteMany({}) .
Learn: Because an empty object is basically a condition, that ALL of the documents always match. It would be like simply using an empty
 object in the .find() . So these two, kinda is like each other(they both match all the docs in the collection):
 db.tours.find();
 db.tours.find({}); // I'm not sure, this gonna match all of the docs in the collection.
 db.tours.deleteMany({});

Also for deleting, for first arg it takes the filter object... */
/* 80-10. Using Compass App for CRUD Operations:
Instead of using the terminal to work with mongodb, we can also use an app with a graphical user interface that mongodb provides us, which is
called Compass.

On compass app, right away, you should be on the screen for creating a new connection and if you're not, then just click on "new connection"
in sidebar.

Important: Now in order to create a connection to your local mongo database, make sure that you have the mongo server running in the background.
 You can start server by: mongod.exe or running mongod command and if the port of the running mongo shell is 27017, then it means, you
 actually already have that automatically fill in, for you.
In compass, the hostname, by default, is localhost and the port is 27017 just like we saw in our mongo server and so you actually do not
have to fill anything and all we have to do is to click on connect button and after that, you see all the dbs that we locally have on our
computer, on that list and also on the left sidebar.
Just to make sure that that list is correct, run: show dbs .

When creating docs, hit tab for setting the value of property.

Compass is just a graphical UI for doing the exact same stuff that we can do in terminal with mongo shell.

In filter input of collection, we need to write the kind of code that we wrote in mongo shell. For example let's search for the tours
with a price less than 700:
type: {price: {$lt: 700}} in that filter input.

Learn: project or projection means: In the result docs, just select(show) some of the fields that I specified .
You can project the select result by clicking on OPTIONS button in that filter input.



81-11. Creating a Hosted Database with Atlas:
Let's create a remote database, hosted on mongodb atlas.
So for developing our project, we will actually NOT use a local db on our computer, like we've been doing in the section until this point.
So instead, we're gonna use a remote db, hosted on a service, called Atlas, which is actually owned by the same company that develops mongodb.
For doing this, on mongodb website, go to products/cloud/mongodb atlas.
Atlas is a so-called, database as a service provider which takes all the pain of managing and scaling dbs, away from us. So that already is a
huge advantage for us, but it's also extremely useful to always have our data, basically in the cloud. Because this way,
we can develop our app, FROM EVERYWHERE and even more importantly, we don't have to export data from the local db and then upload it to a hosted
db, once we are ready to deploy our app. So instead, we simply use this hosted db, right from the beginning, instead of even messing
with local dbs in the first place.

We will look at how to connect our app later, with both a db hosted on atlas and also a local db.

On atlas, first create a new project. You should then give yourself, the project owner permission which should by default be enabled already
and then just click on "create project" button.
So we have our project created, now it's time to build a cluster.

A cluster is basically like an instance of our database.
Now it's time to configure the cluster. M0 stands for free cluster.
So now our cluster is being created, which usually takes some time.

Now you have a blank empty db, ready to connect to your own development computer.

82-12. Connecting to Our Hosted Database:
Let's now connect our remote hosted db with our compass app and also with the mongo shell.
In atlas app, open the connect assistant by clicking on connect button and then, before we can actually connect, we need to do a couple
of things.
First, we need to add our current IP address, so that our computer is actually able to connect to that cluster.
Next, create a username and password.
Now where am i gonna save these?
In config.env file of our app and so that is what we created that file for, in the first place. So remember that I said that each
configuration, we will gonna save it into that file and the db password is a perfect example for that. So add the DATABASE_PASSWORD
to that file and set it to the password that you just set for password of user of that remote mongodb and later, when we will then connect
our app to the db, we will then of course use that env variable to create that connection.
Now, click on "create mongodb user" button. Then we have to choose a connection method and we're gonna start with the mongodb compass application.
So click on "connect with mongodb compass" option. Then copy that connection string that it gives you and then in compass, go to
connect/connect to and the opened window will have automatically detected that we have a mongodb connection string in our clipboard and
so all we have to do is to hit yes on that alert message and it will then automatically fill all of those settings for us.
Now all we need is to enter the password(copy it from config.env).
After it loads our dbs, we see 3 dbs(admin, config and local) that already come pre-configured in that cluster. Now let's create a new one, called natours.
Then go to it's tours collection and then insert some doc and just like that, we have our first tours(docs), created on our REMOTE db.

Now let's back to cluster. You can see tour dbs and the docs that you just created in compass! So they are sync and it means that our connection
is really working.

After building the cluster, we must connect our remote hosted database to our compass app in computer and also the mongo shell.
After creating the admin of this project in mongodb atlas, you must save the password of that user (admin) in your .config file.
So a db password is a great example for .config env file.
After that we must choose a connection method and we will start by choosing mongodb compass application.
So as you saw, the compass application is for interacting with atlas.Now it would give you a connection string. Past it in compass.
Now our compass app is trully connected to the online cluster and atlas.

Now another thing that we can and should do is to allow access from everywhere to that cluster.
Because remember: In the beginning, we whitelisted our IP address in order to grant access for our current computer to the that cluster.
But if happen to switch to other computers during development or ... you might need to whitelist the IP of those computers as well,
because otherwise, you might not be able to connect.
But since we're not really dealing with sensitive data here anyway, we can simply whitelist any other IP(every single IP) in the world and
allow access from anywhere. But of course, we will always still need our username and password, but this way, we don't need to keep adding
our computers (IPs) to whitelist. We will simply whitelist all IPs that exist in the world and allow access from everywhere! Now of course
we will always still need our username and password, but this way we don't need to keep adding our computers to whitelist. We will simply
whitelist all IPs that exist.

So go to clusters/ security/ IP whitelist and then on right side, click on add IP address button and then click on
"Allow access from anywhere" button, which makes that whitelist entry input to 0.0.0.0/0 and then the IP whitelist should be 0.0.0.0/0 .
Now you can see your previous IP address as a row in the IP Address table and then also another row with 0.0.0.0/0 as new row.

Now just as last step, let's also connect our mongo shell to this cluster. So go to clusters>connect>connect with the mongo shell.
Click on "I have the mongo shell installed". Then copy that connection string now if you're running mongo shell, you have to quite it using quite() .
Why we needed to quite it?
Because that is STILL connected to our locally running mongo server. But now, we no longer want that, we want to connect to our HOSTED DB.
Now copy the connection string which says: mongo "mongodb+srv://cluster..." --username <username>. Then enter the password of username of db.
Now if your run: show dbs, it will show all the databases in that specified cluster. So you should see the natours db.
Now in that tab of terminal you are connected to that database in atlas.
Now you can switch to natours db by running: use natours
Then run: db.tours.find() to see all the docs for tours collection.

Now both compass and mongo shell are connected to our remote database, hosted on atlas.

Now let's connect our db with our express application. */

/* Mongodb:
There is no need to define a document data schema before filling it with data. Meaning that each document can have a different number
and type of fields and we can also change these fields all the time.
Mongodb uses a data format similar to Json for data storage called BSON. Basically it looks the same to JSON, but it's typed.
Meaning that all values will have a data type like boolean and ... .
In mongo, we can multiple values for one field that are in an array.But in relational db, that's not allowed, so we can't have
multiple values in one field(column).
Also in mongodb we can have embedded documents.For example in one field, we could have an array of documents, which are like
child documents for their parent field and that parent field is a child to the document. For example we can embed comment documents
into the post document.
So embedded or denormalizing means including related data into a single document. (But it's not the best solution always.
But in relational databases, data is always normalized.So in these kind of dbs, it's not possible to embed data.So the solution is
to create a whole new table and in this case that table is comments and then JOIN this table to posts table by referencing to the
id field of comments table.)

The maximum size of each document currently is 16MB.
Each document contains a unique id, which acts as a primary keyof that document.That unique id is automatically generated with the
object ID data type each time there's a new document.*/
/* For connecting the atlas cluster to our app, we must store the connection string in the .config file.
Remember: When you're using local database instead of atlas, never close mongod.exe terminal. */

