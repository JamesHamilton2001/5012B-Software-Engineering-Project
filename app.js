import express from 'express';
import path from 'path';

import 'chart.js';

import User from './model/User.js';

const app = express();

// view engine setup
app.set('views', path.join('./', 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join('./', 'public')));

// TODO: probably separate this back out to another file, but for now it's fine here.
app.all('/login', async (req, res) => {
   if(req.body.username !== undefined) {
      const u = await User.getByUsername(req.body.username);
      if(u !== null && await u.matchPassword(req.body.password)) {
         // Successful login; redirecting somewhere...
         // TODO: possibly redirect to the page the user was trying to access before
         res.redirect(418, 'dashboard');
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

app.get('/', (req, res) => {
  res.render('index', { title: 'HealthMate App' });
});

app.get('/dashboard' , (req, res) => {
  res.render('dashboard', { title: 'My Dashboard' });
});

app.get('/progress' , (req, res) => {
  res.render('progress', { title: 'My Progress' });
});

app.get('/signup' , (req, res) => {
  res.render('signup', { title: 'HealthMate Signup' });
});

export { app as app };

