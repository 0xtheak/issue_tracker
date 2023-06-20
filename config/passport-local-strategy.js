const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');


// authentication using passport
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback : true
    },
    async function(req, email, password, done){
        // find a user and establish the identity
        const user = await User.findOne({email : email});
       
            if(user){
                // password comparing
                bcrypt.compare(password, user.password, function(err, result){
                    if(result){
                        
                        return done(null, user);
                    }
                    req.flash('error', 'Invalid credentials');
                    return done(null, false);
                    
                });
            }else{
                req.flash('error', 'Invalid credentials');
                return done(null, false);
            }
            
        }
));




// serializing the user to decide which key is to be kept  in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserializing the user  from the key in the cookies
passport.deserializeUser(async function(id, done){
    const user = User.findById(id);
   
        if(user){
            
            return done(null, user);
        }

    console.log('user didnt exit in database --> Passport');  
    return done(null, false);
});

// check if the user is authenticated
passport.checkAuthetication = function(req, res, next){
    // if the user is signed in, the pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    req.flash('error', 'Please Sign in first');
    // if the user is not sign in
    return res.redirect('/login');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals of the views
        res.locals.user  = req.user;
    }
    next();
}


module.exports = passport;