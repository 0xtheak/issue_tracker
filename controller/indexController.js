const User = require('../models/User');
const bcrypt = require('bcrypt');
const Project = require('../models/Project');
const saltRounds = 10;

module.exports  = {
    index : async(req,res) => {
        let title = 'Issue Tracker';
        const projects = await Project.find({type : 'PUBLIC'});
        const privateProjects = await Project.find({user : res.locals.user._id});
        return res.render('index',{title, projects, privateProjects});
    },
    login : (req, res) => {
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        return res.render('login', {
            title : 'Login',
        });
    },

    loginPost : (req, res) => {
        req.flash('success', 'Logged in successfully!');
        return res.redirect('/');
    },

    register : (req,res) => {
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        return res.render('register', {
            title : 'Register'
        });
    },

    registerPost : async function(req, res){
        try{
            
            if(req.body.password != req.body.confirm_password){
                return res.redirect('back');
            }
    
            let user = await User.findOne({email : req.body.email});
            
            if(!user){
                // creating the hash from user supplied password
                let hashPassword = new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                        if(err) reject(err);
                        resolve(hash);
                    })
                });
                hashPassword.then(async (result)=>{
                    if(result){
                        let newUser = await User.create({
                            name : req.body.name,
                            email : req.body.email,
                            password : result,
                            status : true
                        });
                        req.flash('success', 'Account created successfully');
                        return res.redirect('/login');
                    }
                    
                });
                
            }else{
                return res.redirect('back');
            }
            
        }catch(err){
            if(err){
                return;  
            }
            return res.redirect('back');
    
        }
    },
    logout : function(req, res){
        req.logout((err) => {
            if(err){
                
                return next(err);
            }
            req.flash('success', 'You Have Logged out!');
            return res.redirect('/login');
        });
    }
    
}