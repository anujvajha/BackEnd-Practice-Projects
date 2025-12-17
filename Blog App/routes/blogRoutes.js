const express = require('express');
const router = express.Router();
const {post_signup, post_login, get_signup, get_login, get_logout, get_blog, post_blog, get_req, delete_blog} = require('../controllers/blogControllers.js');
const {requireAuth} = require('../middleware/blogMiddleware.js');

router.get('/', get_req);

router.post('/signup', post_signup);

router.get('/signup', get_signup);

router.get('/login', get_login);

router.post('/login', post_login);

router.get('/logout', get_logout);

router.get('/blog', requireAuth, get_blog);

router.post('/blog', requireAuth, post_blog);

router.post('/blog/delete', requireAuth, delete_blog);



module.exports = router;