const User = require('../models/User');
const bcrypt = require('bcrypt');
const Project = require('../models/Project');
const saltRounds = 10;

module.exports  = {
    index : async(req,res) => {
        
        let title = 'Issue Tracker';
        const projects = await Project.find({});
        console.log(projects)
      
        return res.render('index',{title, projects});
    },
    filterProjectDetails : async (req, res) => {
        try {
            
            
            const filReq = req.body;
            
            if(filReq.flexRadio == 'author'){
                const projects = await Project.find().sort({"author" : 1});
               
                return res.render('index',{title : 'Issue Tracker', projects});
            }
            if(filReq.flexRadio == 'title'){
                const projects = await Project.find().sort({"title" : 1});
                
                return res.render('index',{title : 'Issue Tracker', projects});
            }
            if(filReq.flexRadio == 'description'){
                const projects = await Project.find().sort({"description" : 1});
                
                return res.render('index',{title : 'Issue Tracker', projects});
            }
        }catch {
            req.flash("error", "Internal server error");
            return res.redirect('back' || '/');
        }
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
    },

    profile : function(req, res) {
        

        return res.render('profile', {
            title : 'Profile'
        })
    },

    profilePost : async function(req, res){
        try{
            
            const {current_password, new_password, confirm_password, id} = req.body;
            if(new_password != confirm_password){
                req.flash("error", "new password and confirm password didn't match");
                return res.redirect('back');
            }
            const user = await User.findById({_id : id});
            console.log(user);
            if(user){
                bcrypt.compare(current_password, user.password, function(err, result){
                    if(result){
    
                        let hashPassword = new Promise((resolve, reject) => {
                            bcrypt.hash(req.body.new_password, saltRounds, (err, hash) => {
                                if(err) reject(err);
                                resolve(hash);
                            })
                        });
                        hashPassword.then((resultant_hash)=>{
                            if(resultant_hash){
                                user.password=resultant_hash;
                                user.save();
                            }
                        })
                        
                    }
                });
                req.flash("success", "User password updated successfully!");
                return res.redirect('back')
            }else {
                req.flash("error", "Didn't find the user");
                return res.redirect('back');
            }
            

        }catch {
            req.flash("error", "Internal server error");
            return res.redirect('back');
        }
    }
    
}