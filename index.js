require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/mongoose');

const app = express();

app.listen(3000, (err) => {
    if(err){
        console.log(err);
    }
    console.log('server has been started on port 3000');
})