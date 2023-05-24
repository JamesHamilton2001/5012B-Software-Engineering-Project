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


// Access the current user's weight data.
router.route('/user/weight')
   // Return weight data for the currently logged in user.
   .get(async (req, res) => {
      const data = await res.locals.user.getWeight(req.query.limit, req.query.start, req.query.end);
      res.json(data);
   });
   // Add a new weight record for the currently logged in user.
   .post(async (req, res) => {
      const data = await res.locals.user.addWeight(req.body.weight, Math.floor(Date.now() / 1000));
      res.status(201).json("weight record added");
   });


export default router;

