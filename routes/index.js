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

// passport google oauth
router.route('/auth/google/')
        .get(passport.authenticate('google', {
            scope : ['profile', 'email']
        }))

router.route('/auth/google/callback')
        .get(passport.authenticate('google', {failureRedirect : '/login'}), indexController.loginPost)

// profile route
router.route('/profile')
        .get(indexController.profile)
        .post(indexController.profilePost)

// session destroy route
router.route('/logout')
        .get(indexController.logout)


// project route
router.use('/project', require('./projectRoutes'));
module.exports = router;