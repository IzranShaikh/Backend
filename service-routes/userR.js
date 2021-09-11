const express = require('express');
const router = express.Router();
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const urlPrefix = "/api/user";

//CONTROLLER
const UserController = require('../controllers/userC');
//Register
app.post(urlPrefix + '/signup', UserController.signup);
//Login
app.post(urlPrefix + '/login', UserController.login);

const PORT = process.env.PORT_FOR_USER_S;
app.listen(PORT, () => {
    console.log('Users Service running on port ' + PORT);
});