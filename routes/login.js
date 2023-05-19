import * as userModel from '../model/User.js';
import express from 'express';

const login = express.Router();

/* GET users listing. */
login.get('/', function(req, res, next) {
  res.render('login',{title: 'Healthmate Login'})
});

login.post('/', function(req, res, next){
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

export { login as login };
