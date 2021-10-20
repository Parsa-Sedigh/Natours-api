const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 🧨 . Shutting down ...');
  console.log(err, err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
});

dotenv.config({ path: './config.env' });

const app = require('./app');

/* We don't want to leak our database password, so we can replace the <passowrd> in connection string with the database password
in .config file.
In .connect() method for mongoose, in second arg we need to pass in an object of options in order to deal with some dependency
and deprecation warnings. Also remember: connect() method is gonna return a promise and in result (resolved value) of .then()
we have access to connection object or con. */
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then((con) => {
    // console.log(con.connection);
    console.log('DB connection successful!');
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

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🧨 . Shutting down ...');
  console.log(err, err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
