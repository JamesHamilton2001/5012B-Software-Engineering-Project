// This module responds to all requests to the /auth route.
// This is responsible for user authentication/login, along with signup.
import express from 'express';

import User from './model/User.js';

const router = express.Router();


// Logging out has to be the highest priority route to avoid redirection
router.all('/logout', (req, res) => {
   res.clearCookie('auth');
   res.redirect('/');
   return;
});


// Redirect authenticated users to the home page
router.use((req, res, next) => {
   if(req.user) {
      res.redirect('/');
      return;
   }
   next();
});


// Handles user login attempts.
router.all('/login', async (req, res) => {
   // TODO: redirect somewhere if the user is already logged in
   if(req.method == 'POST') {
      const u = await User.getByUsername(req.body.username);
      if(u !== null && await u.matchPassword(req.body.password)) {
         // Successful login
         // Setting aurhentication cookie...
         res.cookie('auth', JSON.stringify({username: req.body.username, password: req.body.password}));
         // Redirecting somewhere...
         res.redirect(302, req.cookies.redirect || '/');
         return;
      }
      // Login failed; set an error message and re-render the login form.
      res.locals.error = 'Invalid username or password.';
   }

   // Render the login form, potentially with the previously entered username re-filled.
   // Should additionally show an error message if there appears to have been a failed
   // login attempt.
   res.render('login', {
      title: 'HealthMate Login',
      // TODO: check if this is sanitised at all automatically!
      username: req.body.username || '',
   });
});


// Handles user signup attempts.
router.all('/signup', async (req, res) => {
   if(req.method == 'POST') {
      res.locals.error = await checkSignupData(req.body.username, req.body.email, req.body.password, req.body.real_name, req.body.height);

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


// Check signup data and return the most pressing error, or null if there are none.
async function checkSignupData(username, email, password, real_name, height) {
   if(!User.validUsername(username))
      return 'Username not valid.';
   if(!await User.availableUsername(username))
      return 'Username unavailable.';
   if(!User.validEmail(email))
      return 'Email not valid.';
   if(!await User.availableEmail(email))
      return 'Email unavailable.';
   if(!User.validPassword(password))
      return 'Password not valid.';
   if(!User.validRealName(real_name))
      return 'Name not valid.';
   if(!User.validHeight(height))
      return 'Height not valid.';
   return null;
}


// Check auth cookie so we can note the logged in user, if there is one.
async function authCookie(req, res, next) {
   if('auth' in req.cookies) {
      // auth cookie exists; parse it and check password
      const auth = JSON.parse(req.cookies.auth);
      const usr = await User.getByUsername(auth.username);
      if(usr !== null && await usr.matchPassword(auth.password)) {
         // Authentication successful; set the user object in the response locals
         req.user = usr;
      }
   }
   // Proceed to the next middleware/route
   next();
}


// Redirecrt unauthenticated requests to the login page
function redirectUnauthenticated(req, res, next) {
   if(!req.user) {
      // Note where the user was trying to go so we can redirect after login
      res.cookie('redirect', req.url);
      res.redirect(302, '/auth/login');
      return;
   }
   next();
}


export default {
   router: router,
   cookie: authCookie,
   redirectUnauthenticated,
};

