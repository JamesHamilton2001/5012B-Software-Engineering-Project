const userModel = require('../model/User.js');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login',{title: 'Healthmate Login'})
});

router.post('/', function(req, res, next){
  const username = req.body.username;
  const password = req.body.password;

  let loginResult = userModel.verifyCredentials(username, password);

  if(loginResult){
    res.render('dashboard', {title: username})
  }
  else{
    res.render('login', {error: true});
  }
});

module.exports = router;
