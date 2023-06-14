require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODBURL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "database connection failed"));

db.once('open', (err) => {
    if(err){
        console.log(err);
    }
    console.log('database connected successfully');
});

module.exports = db;