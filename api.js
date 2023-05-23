// This module responds to all requests to the /api route, and is reponsible for
// sending out JSON data to the client on request.
import express from 'express';

const router = express.Router();


// Test the top level /api route
router.get('/', (req, res) => {
   res.json({message: 'Hello from the API!'});
});


// Returns the currently logged in user, or null if no user is logged in.
router.get('/user', (req, res) => {
   res.json(res.locals.user);
});


// Middleware to inject current user id for '/user/current(/*)' routes
router.use('/user', (req, res, next) => {
   if(req.url.startsWith('/current')) {
      if(res.locals.user === undefined) {
         res.status(401).json({error: 'Not logged in.'});
         return;
      }
      req.url = req.url.replace(/^\/current/, '/' + res.locals.user.id);
   }
   next();
});


export default router;

