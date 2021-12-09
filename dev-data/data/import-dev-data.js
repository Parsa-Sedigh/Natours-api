
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

/* Read THE JSON FILE.  */
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tour-simple.json`, 'utf-8'));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

/* Import DATA INTO DB.*/
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data successfully loaded.');

    }catch(err) {
        console.log(err);
    }

    // I put this here, so that no matter there is error or not, it will always exist the process.
    process.exit();
};

/* Delete all old data from the collection. */
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted.');

    } catch(err) {
        console.log(err);
    }
    process.exit();
};

console.log(process.argv);

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}



