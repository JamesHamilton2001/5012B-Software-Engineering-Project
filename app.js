import 'http-errors';
import express from 'express';
import path from 'path';

import 'chart.js';
import { login } from './routes/login.js';
import { profile } from './routes/profile.js';

const app = express();

// view engine setup
app.set('views', path.join('./', 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join('./', 'public')));

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

app.use('/login', login);
app.use('/profile', profile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(res);
  console.log(req);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export { app as app };
