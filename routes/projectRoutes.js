const express = require('express');
const router = express.Router();
const passport = require('passport');
const projectController = require('../controller/projectController');

router.route('/create')
    .get(passport.checkAuthetication, projectController.create)
    .post(passport.checkAuthetication, projectController.createPost)




module.exports = router;