const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 🧨 . Shutting down ...');
  console.log(err, err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

/* We don't want to leak our database password, so we can replace the <passowrd> in connection string with the database password
in .config file.
In .connect() method for mongoose, in second arg we need to pass in an object of options in order to deal with some dependency
and deprecation warnings. Also remember: connect() method is gonna return a promise and in result (resolved value) of .then()
we have access to connection object or con. */
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then((con) => {
    // console.log(con.connection);
    console.log("DB connection successful!");
  });
// .catch((err) => {
//     console.log(err);
//     console.log('DB connection failed!');
// });

const port = process.env.PORT || 3000;

/* The second arg will be called as soon as the server starts listening. */
const server = app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

/* With this event listener, we're not just handle failed db connection but also any other promise rejection that we might not
catch somewhere in the application is handled here in this event listener. So with this event listener we don't get any unhandled promsie
rejection error in console.
So it's good to have a central place like this to handle all promise rejections like a safety net. Now if we really have a problem with
database connection like wrong password or ... , then our app is not going to work at all. So in here we can shut down our application.
For this task we use process.exit() . In () of exit() we can pass in a code and 0 stands for success and 1 stands for uncaught exception.
By using process.exit(1); we would see: arr crashed - waiting for file changes before starting...
Now there's one problem with the way that we implemented things like this. The problem is that process.exit(1); is very abrupt way of
ending program. Because this will just immediately abort all the requests that are currently STILL running or pending and so this is
not good and so we usually what we do is to shutdown gracefully, which we first close the server and only then we shutdown the application.

Learn: For shutting down server and app gracefully, first you need to save the result of
 app.listen(port, () => {
 console.log(`App running on port ${port} ...`);
 });
 into a variable. In our code, that variable is called server.
 Basically the result of app.listen(port, callback) is a server.
 Then we use server.close(() => {}) in process.on('unhandledRejection'm ()=> {})
 After the server is closed, it would run that callback function which is inside it's parentheses and it's only in that callback that
 we SHUTDOWN the server.

So by doing server.close() we are giving the server some time to finish all the requests that are still pending or being handled
at the time and only after finishing them, the server is basically killed.
Also it's not ideal that in the shutdown we see: app crashed - ... . Because at that point the app is not working at all and therefore
crashed is not very meaningful.So usually in a production app on a web server, we will usually have some tool in the place that
restarts the app right after it crashes. Or also some of the platforms that host node.js apps will automatically do that on their own.
Because of course we don't want to leave application hanging like tha(app crashed - ...)t forever.
So 'unhandledRejection' is for errors that occur in async codes which were not handled. Now what about sync codes? */
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 🧨 . Shutting down ...');
    console.log(err, err.name, err.message);
    server.close(() => {
    process.exit(1);
    });
});

