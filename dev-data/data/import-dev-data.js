/* Let's write a script that will import data from a json file into the mongodb.
In this file we also need to connect do db again, because this file runs completely independent from our express application.
This file will only run once in the beginning.
Important: We also need the tourModel file because that file is where we want to write our data to. */
/* Important: When you're running node command, the current directory that you're in is very important.
    __dirname is always the directory in which the currently executing script resides. So if you typed __dirname into
    /d1/d2/myscript.js, the value of __dirname would be /d1/d2. By contrast, . (dot)gives you the directory from which you ran
    the node command in your terminal window. BUT WE HAVE AN EXCEPTION FOR dot (.) INSIDE require():
    If inside dir2/pathtest.js you have a require call into include a file inside dir1 you would always do:
    require('../thefile') .
    Because the path inside require is always relative to the file in which you are calling it. It has nothing to do
    with your working directory.
    
    So for running this file from the root of the project, we must run the command: node ./dev-data/data/import-dev-data.js
    
    So we learned that ./ is always pointing to the current working directory except in require(). The require() function,
    translates ./ to the directory of the current file (where the script is located). */

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const Tour = require('../../models/tourModel');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then((con) => {
        console.log('DB connection successful!');
    })
    .catch((err) => {
        console.log(err);
        console.log('DB connection failed!');
    });

/* Read the json file. 
Remember: When you read a file which has json file, the variable that we store the result of fs.readFileSync() would be JSON,
so after reading the file, we need to convert the data of that file into a valid JS object, by using JSON.parse() on the file.
Important: In first arg of readFileSync() or './tour-simple.json' the dot is always relative to the folder where the node 
application was actually started. So the dot would point to the home folder, so now we're looking for this file in the home
folder, so it would give us an error.So we must use __dirname which is available for us everywhere.  */
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tour-simple.json`, 'utf-8'));

/* Import data into database. 
create() method accepts an object. But it can also accepts an array of objects and in that case, it will create a new doc for
each of the objects in the array. */

const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data successfuly inserted.');
        
    }catch(err) {
        console.log(err);
    }
    process.exit();
};

/* Delete all old data from the collection.
process.exit() is an aggressive way of stopping an application. But in this little script, it doesn't matter. It wasen't 
really matter to add this method here in our code, but it makes our lives a bit easier so we don't need to use ctrl+c to 
exit the application after the node command has finished. Also I put this process.exit() outside of try catch block, because 
with this, no matter there's an error or not, the process.exit() will always executed. */
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfuly deleted.');
        
    } catch(err) {
        console.log(err);
    }
    process.exit();
};

console.log(process.argv);
/* You can call the functions here, but let's work with terminal. So we can set things up so when we enter some options when
running the node command, one of our functions will be called and for other option, other function will run. 
process.argv is an array of 2 arguments that are running the node process. The first element in that array is where the node
command is located and the second element in the array is where the script file is located (not the current working directory!)
Now when you want to run: node <path from current working directory to where the scripts file is located> , you can specify some
options in end of the command. So let's say: node ./dev-data/data/import-dev-data.js --import . Now in process.argv we have 3
elements in array. 2 of them are repetitious, but the new one is the option that we put for running the node command which in this
case is --import.*/
/* In terminal we can use -- to specify the options.   */

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}



