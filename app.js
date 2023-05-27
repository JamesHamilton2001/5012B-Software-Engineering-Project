import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import sass from 'sass';

import api from './api.js';
import auth from './auth.js';
import './db.js';
import User from './model/User.js';
import Goal from './model/Goal.js';

const app = express();

// view engine setup
app.set('views', path.join('./', 'views'));
app.set('view engine', 'pug');

// Don't render all the HTML on a single line...
app.locals.pretty = true;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Rough SASS preprocessor
app.get('/css/*.scss', (req, res) => {
   // TODO: decide where SASS files should actually live; public is probably not really appropriate
   const compiled = sass.compile('public' + req.url);
   res.set('Content-Type', 'text/css');
   res.send(compiled.css);
});


// Serve anything in /public as static
app.use(express.static(path.join('./', 'public')));


// Middleware so we don't have to regex out our login cookie ourselves
app.use(cookieParser());


// Check if a user is logged in, and if so note them in req.user
app.use(auth.cookie);


// Route all API requests to the api.js module
app.use('/api', api);


// User login/signup/etc.
app.use('/auth', auth.router);


// Redirect all unauthenticated requests to the login page
app.use(auth.redirectUnauthenticated);


app.get('/', (req, res) => {
  res.render('index', { title: 'HealthMate App' });
});

app.get('/dashboard' , (req, res) => {
  res.render('dashboard', { title: 'My Dashboard' });
});

app.get('/progress' , (req, res) => {
  res.render('progress', { title: 'My Progress' });
});

app.get('/exercise' , (req, res) => {
   res.render('exercise', {
   });
});

app.get('/goal', (req, res) => {
  res.render('goal' ,{title: 'New Goal'});
})

// app.post('/newGoal', (req,res) => {
//   res.send('Goal data recieved')
   
//   let exerciseType = req.body.exerciseType
//   let target = req.
//   console.log(target)
//   //Goal.add();
//   // console.log(res)
// })


export { app as app };

