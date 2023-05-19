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

export { app as app };
