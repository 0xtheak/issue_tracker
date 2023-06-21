const express = require('express');
const router = express.Router();
const passport = require('passport');
const projectController = require('../controller/projectController');

router.route('/create')
    .get(passport.checkAuthetication, projectController.create)
    .post(passport.checkAuthetication, projectController.createPost)

router.route('/:slug')
    .get(projectController.viewProject)


router.route('/issues/:id/create')
    .get(projectController.createIssue)
    .post(projectController.createIssuePost);

module.exports = router;