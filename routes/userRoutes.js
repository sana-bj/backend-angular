var express = require('express');
const userController = require('../controllers/userController')

var router = express.Router();

/* GET home page. */
//router.post('/signup', userController.signup);

//router.post('/login', userController.login)
router.post('/login', userController.login)
module.exports = router;