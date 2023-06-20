const User = require('../models/User');
const Project = require('../models/Project');
const Issue = require('../models/Issue');

module.exports = {
    create : (req, res) => {
        return res.render('create', {
            title : 'Create Project',
        });
    }, 
    createPost : async (req, res) => {
        try {
            const { title, description, author, type } = req.body;
            const user = req.userData;
            const project = new Project({
                title, description, author, user: user._id, type
            });
            project.save((err) => {
                if (err) {
                    // req.session.message = {
                    //     type: "error",
                    //     message: err.message || 'Unable to create project',
                    // };
                    return res.redirect('back' || '/project/create')
                }
                User.findByIdAndUpdate(user._id, { $push: { projects: { project: project._id } } }, { new: true }, (error, userDetails) => {
                    if (error) {
                        req.session.message = {
                            type: "error",
                            message: err.message || 'Error Occured while adding project to user table',
                        };
                        return res.redirect('/')
                    }
                    // req.session.message = {
                    //     type: "success",
                    //     message: "Project Created Successfully",
                    // };
                    return res.redirect("/");
                });
            });
        } catch (error) {
            req.session.message = {
                type: 'error',
                message: error.message || 'Internal Server Error'
            };
            return resp.redirect('/project/create');
        }
    }
}