// This module responds to all requests to the /api route, and is reponsible for
// sending out JSON data to the client on request.
import express from 'express';

import User from './model/User.js';

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


// Return all the details for a given user.
// TODO: address the obvious security concerns here.
router.get('/user/:id', async (req, res) => {
   const usr = await User.getByID(req.params.id);
   res.json(usr);
});


// Return the latest weight data for a given user.
// TODO: address the obvious security concerns here.
router.get('/user/:id/weight', async (req, res) => {
   const usr = await User.getByID(req.params.id);
   const data = await usr.getWeight(req.query.limit, req.query.start, req.query.end);
   res.json(data);
});


// Add a new weight record for a given user.
// TODO: this should _absolutely_ only allow this for the current user when this is finalised!
router.post('/user/:id/weight', async (req, res) => {
   const usr = await User.getByID(req.params.id);
   const data = await usr.addWeight(req.body.weight, Math.floor(Date.now() / 1000));
   res.status(201).json("weight record added");
});


export default router;

