const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

passport.use(new googleStrategy({
    clientID: process.env.GoogleClientID,
    clientSecret : process.env.GoogleClientSecret,
    callbackURL : process.env.GoogleCallbackURL
    },
    function(accessToken, refreshToken, profile, done){
        User.findOne({email : profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log(`error in google strategy passport ${err}`);
                return;
            }
            console.log(profile);
            if(user){
                return done(null, user);

            }else{
                // creating random password for google oauth signup
                let tempPass = crypto.randomBytes(20).toString('hex');
                let hashPassword = new Promise((resolve, reject) => {
                    bcrypt.hash(tempPass, saltRounds, (err, hash) => {
                        if(err) reject(err);
                        resolve(hash);
                    })
                });
                hashPassword.then((result)=>{
                    if(result){
                        let newUser = User.create({
                            name : profile.displayName,
                            email : profile.emails[0].value,
                            password : result,
                            status : true
                        },function(err, user){
                                if(err){
                                    console.log(`error in creating google strategy passport ${err}`);
                                    return;
                                }
                                return done(null, user);
                            });
                    }
                    
                });
            }
        });
    }
));

module.exports = passport;