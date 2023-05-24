import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import sass from 'sass';

import 'chart.js';

import api from './api.js';
import auth from './auth.js';
import './db.js';
import User from './model/User.js';

const app = express();

// view engine setup
app.set('views', path.join('./', 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Rough SASS preprocessor
app.get('/css/*.scss', (req, res) => {
   const compiled = sass.compile('public' + req.url);
   res.set('Content-Type', 'text/css');
   res.send(compiled.css);
});


// Serve anything in /public as static
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


export { app as app };

