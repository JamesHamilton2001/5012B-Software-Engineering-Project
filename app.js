import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import 'chart.js';

import api from './api.js';
import auth from './auth.js';
import './db.js';
import User from './model/User.js';
import Goal from './model/Goal.js';

const app = express();

// view engine setup
app.set('views', path.join('./', 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join('./', 'public')));


// Middleare so we dont' have to regex out our logic cookie ourselves
app.use(cookieParser());


// Check if a user is logged in, and if so note them in req.user
app.use(auth.cookie);


// Route all API requests to the api.js module
app.use('/api', api);


// User login/signup/etc.
app.use('/auth', auth.router);


app.get('/', (req, res) => {
  res.render('index', { title: 'HealthMate App' });
});

app.get('/dashboard' , (req, res) => {
  res.render('dashboard', { title: 'My Dashboard' });
});

app.get('/progress' , (req, res) => {
  res.render('progress', { title: 'My Progress' });
});

app.get('/goal', (req, res) => {
  res.render('goal' ,{title: 'New Goal'});
})

app.get('/goal_created', (req,res) => {
  res.render('goal_created');
})

var today = new Date();
var dd = String(today.getDate());
var mm = String(today.getMonth() + 1); //January is 0!
var yyyy = today.getFullYear();

today =  yyyy + '-' + mm + '-' + dd;


//Method that handles POST request from goal page
app.post('/newGoal', (req,res) => {
  let exerciseType = req.body.exercise;
  let target = req.body.target;
  let start_time = today;
  let endTime = req.body.endTime;
  
  console.log(exerciseType)
  console.log(target)
  console.log(start_time)
  console.log(endTime)
  

  //res.send('Goal data recieved')
  res.render('goal_created')
  return;
  
  //Goal.add();
  // console.log(res)
})


export { app as app };

