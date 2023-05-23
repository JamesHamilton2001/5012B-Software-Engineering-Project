import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

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
app.use(express.static(path.join('./', 'public')));


// Middleare so we dont' have to regex out our logic cookie ourselves
app.use(cookieParser());

// Check auth cookie before we go any further
app.use(async (req, res, next) => {
   if('auth' in req.cookies) {
      // auth cookie exists; parse it and check password
      const auth = JSON.parse(req.cookies.auth);
      const usr = await User.getByUsername(auth.username);
      if(usr !== null && await usr.matchPassword(auth.password)) {
         // Authentication successful; set the user object in the response locals
         res.locals.user = usr;
      }
   }
   // Proceed to the next middleware/route
   next();
});


// Route all API requests to the api.js module
app.use('/api', api);


// User login/signup/etc.
app.use('/auth', auth);


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

