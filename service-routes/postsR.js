const express = require('express');
const app = express();
require('dotenv').config();
const checkAuth = require('../middlewares/check-auth');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const urlPrefix = '/api/thoughts';

//CONTROLLER
const PostController = require('../controllers/postsC');

//Fetch all posts
app.get(urlPrefix, PostController.getAllPosts);

//Fetch one post
app.get(urlPrefix + '/:postId', PostController.getOnePost);

//Upload post
app.post(urlPrefix + '/', checkAuth, PostController.uploadPost);

//Edit post
app.patch(urlPrefix + '/:postId', checkAuth, PostController.editPost);

//Delete one post
app.delete(urlPrefix + '/:postId', checkAuth, PostController.deleteOnePost);

//Delete all posts
app.delete(urlPrefix, PostController.deleteAllPost);

const PORT = process.env.PORT_FOR_THOUGHT_S;
app.listen(PORT, () => {
    console.log('Thoughts Service running on port ' + PORT);
});