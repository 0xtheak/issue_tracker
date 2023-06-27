const express = require('express');
const router = express.Router();
const passport = require('passport');
const projectController = require('../controller/projectController');

// project create 
router.route('/create')
    .get(passport.checkAuthetication, projectController.create)
    .post(passport.checkAuthetication, projectController.createPost)

// project view
router.route('/:slug')
    .get(projectController.viewProject)

// project issue handler routes
router.route('/issues/:id/create')
    .get(projectController.createIssue)
    .post(projectController.createIssuePost);


router.route('/:id/remove')
    .get(projectController.removeProject)

module.exports = router;