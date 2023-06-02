import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'fs';
import path from 'path';
import sass from 'sass';

import api from './api.js';
import auth from './auth.js';
import './db.js';
import User from './model/User.js';
import Goal from './model/Goal.js';

const app = express();

// view engine setup
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
   res.redirect('/dashboard');
});

app.get('/dashboard' , (req, res) => {
  res.render('dashboard');
});

app.get('/progress' , (req, res) => {
  res.render('progress');
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

// Middleware to dynamically render any dashboard partial which actually exists.
// TODO: probably move to /dashboard/partials/:name or similar
app.use('/dashboard/:name', (req, res, next) => {
   const fullpath = path.join(app.get('views'), 'dashboard', req.params.name + '.pug');
   if(fs.existsSync(fullpath))
      res.render(path.join('dashboard', req.params.name));
   next();
});

app.get('/exercise' , (req, res) => {
   res.render('exercise', {
   });
});




export { app as app };

