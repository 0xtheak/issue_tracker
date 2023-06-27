require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const sassMiddleware = require('node-sass-middleware');
const favicon = require('serve-favicon');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMWare = require('./config/middleware');


// sass middleware
app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    debug : true,
    outputStyle : 'extended',
    prefix : '/css'

}));

// cookie use
app.use(cookieParser());


// setting the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./assets'));
// favicon
app.use(favicon("./favicon.ico")); 

// express layout setup
app.use(expressLayouts);
app.use(express.urlencoded({extended : true}));


app.use(session({
    name : process.env.SessionSecretName,
    // TODO change the secret before deployment in production mode
    secret : process.env.SessionSecret,
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000 * 60 * 100)
    },
    store : MongoStore.create(
        {
            mongoUrl : process.env.MONGODBURL,
            autoRemove : 'disabled'
     },
     function(err){
        if(err){
            console.log(err || 'connect-mongodb setup ok');
        }
     })
}));

// Configure and use Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// flash notification
app.use(flash());
app.use(customMWare.setFalsh);

app.use((req, resp, next) => {
    resp.locals.user = req.user;
    // console.log(req.session.user);
    next();
  });

app.use('/', require('./routes/index'));



app.listen(3000, (err) => {
    if(err){
        console.log(err);
    }
    console.log('server has been started on port 3000');
})