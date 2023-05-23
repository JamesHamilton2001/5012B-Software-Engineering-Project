// This module responds to all requests to the /auth route.
// This is responsible for user authentication/login, along with signup.
import express from 'express';

import User from './model/User.js';

const router = express.Router();


// Handles user login attempts.
router.all('/login', async (req, res) => {
   // TODO: redirect somewhere if the user is already logged in
   if(req.body.username !== undefined) {
      const u = await User.getByUsername(req.body.username);
      if(u !== null && await u.matchPassword(req.body.password)) {
         // Successful login
         // Setting aurhentication cookie...
         res.cookie('auth', JSON.stringify({username: req.body.username, password: req.body.password}));
         // Redirecting somewhere...
         // TODO: possibly redirect to the page the user was trying to access before
         res.redirect(418, '/dashboard');
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


// Handles user signup attempts.
router.all('/signup', async (req, res) => {
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


export default router;

