import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import 'chart.js';

import api from './api.js';
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


// TODO: probably separate this back out to another file, but for now it's fine here.
app.all('/login', async (req, res) => {
   // TODO: redirect somewhere if the user is already logged in
   if(req.body.username !== undefined) {
      const u = await User.getByUsername(req.body.username);
      if(u !== null && await u.matchPassword(req.body.password)) {
         // Successful login
         // Setting aurhentication cookie...
         res.cookie('auth', JSON.stringify({username: req.body.username, password: req.body.password}));
         // Redirecting somewhere...
         // TODO: possibly redirect to the page the user was trying to access before
         res.redirect(418, 'dashboard');
         return;
      }
      // Login failed; set an error message and re-render the login form.
      res.locals.error = 'Invalid username or password.';
   }
   // Render the login form, potentially with the previously entered username re-filled.
   // Should additionally show an error message if there appears to have been a failed
   // login attempt.
   res.render('login', {
      title: 'Login ya cunt',
      username: req.body.username || '',
      error: res.locals.error,
   });
});


// TODO: probably also ship this out to a different file, which would also make it easier to split out functions
app.all('/signup', async (req, res) => {
   if(req.method == 'POST') {
      // TODO: should refactor this to be proper function or method somewhere
      res.locals.error = await (async () => {
         if(!User.validUsername(req.body.username))
            return 'Username not valid.';
         if(!await User.availableUsername(req.body.username))
            return 'Username unavailable.';
         if(!User.validEmail(req.body.email))
            return 'Email not valid.';
         if(!await User.availableEmail(req.body.email))
            return 'Email unavailable.';
         if(!User.validPassword(req.body.password))
            return 'Password not valid.';
         if(!User.validRealName(req.body.real_name))
            return 'Name not valid.';
         if(!User.validHeight(req.body.height))
            return 'Height not valid.';
      })() || null;

      if(!res.locals.error) {
         await User.add(req.body.username, req.body.email, req.body.password, req.body.real_name, req.body.height);
         res.render('signup_success', {
            title: 'Signup Success',
            email: req.body.email,
         });
         return;
      }
   }
   res.render('signup', {
      title: 'HealthMate Signup',
      username: req.body.username || '',
      email: req.body.email || '',
      password: req.body.password || '',
      real_name: req.body.real_name || '',
      height: req.body.height || '',
      error: res.locals.error,
   });
});


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

