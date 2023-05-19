import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import 'chart.js';

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
app.all('/signup', (req, res) => {
   if(req.method == 'POST') {
      console.log('Signup page requested by POST...');
      // TODO: should refactor this to be proper function or method somewhere
      res.locals.error = (() => {
         if(!User.validUsername(req.body.username))
            return 'Username not valid.';
         // TODO: check if username is in use already, error out if so
         // TODO: valid/available check email
         // TODO: validate password
         // TODO: real name
         // TODO: height
      })() || null;
      console.log('ERROR: ' + res.locals.error);

      // TODO: add new user to db, send out verification email, etc.
   }
   res.render('signup', { title: 'HealthMate Signup' });
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

