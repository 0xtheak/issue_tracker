const User = require('../models/User');
const Project = require('../models/Project');
const Issue = require('../models/Issue');


module.exports = {
    searchProject : async (req, res) => {
        try {
            
            const search = req.body.search;
            const projects = await Project.find({"title" : {$regex : search, $options : 'i'}});
            if(!projects){
                projects = await Project.find( {"description" : {$regex : search, $options : 'i'}});
            }
            return res.render('index',{title : "Issue Tracker", projects});
            

        }catch {
            req.flash("error", "Internal server error");
            return res.redirect('back');
        }
    },
    create : (req, res) => {
        if(!req.isAuthenticated()){
            return res.redirect('/');
        }
        return res.render('create', {
            title : 'Create Project',
        });
    }, 
    createPost : async (req, res) => {
        try {
            if(!req.isAuthenticated()){
                return res.redirect('/');
            }
            const { title, description, author, id } = req.body;
            
            const project = new Project({
                title, description, author, user : id
            });
            project.save((err) => {
                if (err) {
                    req.flash("error", "Unable to create project")
                    return res.redirect('back' || '/project/create')
                }
                User.findByIdAndUpdate(id, { $push: { projects: { project: project._id } } }, { new: true }, (error, userDetails) => {
                    if (error) {
                        req.flash("error", "Error Occured while adding project to user table");
                        return res.redirect('/')
                    }
                    req.flash("success", "Project Created Successfully")
                    return res.redirect("/");
                });
            });
        } catch (error) {
            req.flash("error", "Internal server error")
            return res.redirect('/project/create');
        }
    },
    viewProject: async (req, res) => {
        try {
            if(!req.isAuthenticated()){
                return res.redirect('/');
            }
            const slug = req.params.slug;
            const project = await Project.findOne({ slug: slug }).populate('issues').exec();
            if (project) {
                let title = project.title;
                return res.render('view', { project, title });
            }
            req.flash("error", "Project not found!")
            return res.redirect('/');
        } catch (error) {
            req.flash("error", "Project not found!")
            return res.redirect('/');
        }
    },      
    createIssue: async (req, res) => {
        try {
            if(!req.isAuthenticated()){
                return res.redirect('/');
            }
            const projectId = req.params.id;
            const project = await Project.findById(projectId).exec();
            const issues = await Issue.findById(project._id).exec();
            console.log(issues)
            if (!project) {
                req.flash("error", "Project not found!");
                return res.status(404).redirect('back');
            }
            const title = `Issues for ${project.title}`;
            return res.render('createIssue', { project, title, issues });
        } catch (error) {
            req.flash("error", "Something went wrong!");
            return res.redirect('/');
        }
    },
    createIssuePost: async (req, res) => {
        try {
            if(!req.isAuthenticated()){
                return res.redirect('/');
            }
            
            const projectId = req.params.id;
            const project = await Project.findById(projectId).exec();
            if (!project) {
                req.flash("error", "Project not found!");
                return res.status(404).redirect('/');
            }
            const { title, description, labels } = req.body;
            if (!title || !description) {
                
                req.flash("error", "Title and description are required fields");
                return res.status(400).redirect('back');
            }
            const user = res.locals.user;
            const newIssue = new Issue({
                user: user._id,
                title: title,
                description: description,
                project: project._id,
                labels : labels
            });
            const result = await newIssue.save();
            if (!result) {
                
                req.flash("error", `Issue with title ${title} could not be saved for project ${project.title}`)
                return res.status(500).redirect('back');
            }

            const saveToUser = await User.findOneAndUpdate(
                {
                    projects: { $elemMatch: { project: project._id } }
                },
                {
                    $push: { 'projects.$.issues': result._id }
                },
                {
                    new: true
                }
            );              
            if(!saveToUser){
                
                req.flash("error", `Issue with title ${title} is saved in issue table  for project ${project.title} but did not saved to user table`)
                return res.status(500).redirect('back');
            }
            const saveToProjectTable = await Project.findByIdAndUpdate(project._id,  { $push: { issues: result._id } },{ new: true });
            if(!saveToProjectTable){
                
                req.flash("error", `Issue with title '${title}' is saved in issue table  for project ${project.title} also saved in user table but did not saved to project table`)
                return res.status(500).redirect('back');
            }
            
            req.flash("success", `Issue for ${title} was successfully created`)
            return res.status(201).redirect('/project/' + saveToProjectTable.slug);
        } catch (error) {
            req.flash("error", "something went wrong");
            return res.status(500).redirect('/');
        }
    },
    removeProject: async (req, res) => {
        try {
            const projectId = req.params.id;
            const project = await Project.findByIdAndRemove(projectId);
            if (!project) {
                req.flash("error", "Project not found!")
                return res.redirect('back');
            }
            await User.updateOne(
                { 'projects.project': projectId },
                { $pull: { projects: { project: projectId } } }
            );
            await Issue.deleteMany({ project: projectId });
            req.flash("success", `Project Deleted successfully`)
            return res.status(200).redirect('/');
        } catch (error) {
            console.error(error);
            req.flash("error", `${error.message || 'Internal Error'}`)
            return res.status(500).redirect('/');
        }
    }
}

