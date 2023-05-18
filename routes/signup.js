const userModel = require('../model/User.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('signup',{title: 'Healthmate Sign Up'})
  });

module.exports = router;