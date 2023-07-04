const express = require('express');
const router = express.Router();
const passport = require('passport');
const projectController = require('../controller/projectController');

// project search
router.route('/search')
    .post(passport.checkAuthetication, projectController.searchProject)

// project create 
router.route('/create')
    .get(passport.checkAuthetication, projectController.create)
    .post(passport.checkAuthetication, projectController.createPost)

// project view
router.route('/:slug')
    .get(passport.checkAuthetication, projectController.viewProject)

// project issue handler routes
router.route('/issues/:id/create')
    .get(passport.checkAuthetication, projectController.createIssue)
    .post(passport.checkAuthetication, projectController.createIssuePost);

// project delete route
router.route('/:id/remove')
    .get(passport.checkAuthetication, projectController.removeProject)



module.exports = router;