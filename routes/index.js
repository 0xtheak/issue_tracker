const express = require('express');
const router = express.Router();
const passport = require('passport');
const indexController = require('../controller/indexController');

// home route
router.route('/')
    .get(passport.checkAuthetication, indexController.index);

// login route
router.route('/login')
    .get( indexController.login)
    // use passport as a middleware to authenticate
    .post(passport.authenticate(
        'local',
        {failureRedirect : '/login'}
    ), indexController.loginPost)

// account creation route
router.route('/register')
    .get( indexController.register)
    .post(indexController.registerPost)

// session destroy route
router.route('/logout')
        .get(indexController.logout)


// project route
router.use('/project', require('./projectRoutes'));
module.exports = router;