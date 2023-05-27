// This module responds to all requests to the /api route, and is reponsible for
// sending out JSON data to the client on request.
import express from 'express';

import User from './model/User.js';
import Goal from './model/Goal.js';

const router = express.Router();


// Test the top level /api route
// TODO: remove this route. respond instead with some error code
router.get('/', (req, res) => {
   res.json({message: 'Hello from the API!'});
});


// Route User-related API requests to a dedicated sub-router
const user = express.Router();
router.use('/user', user);


// Error if there is no user logged in.
user.use((req, res, next) => {
   if(!req.user) {
      res.status(401).json({error: 'No user logged in.'});
      return;
   }
   next();
});


// Returns the currently logged in user, or null if no user is logged in.
user.get('/', (req, res) => {
   res.json(req.user);
});


// Access the current user's weight data.
user.route('/weight')
   // Return weight data for the currently logged in user.
   .get(async (req, res) => {
      const data = await req.user.getWeight(req.query.limit, req.query.start, req.query.end);
      res.json(data);
   })
   // Add a new weight record for the currently logged in user.
   .post(async (req, res) => {
      const data = await req.user.addWeight(req.body.weight, Math.floor(Date.now() / 1000));
      res.status(201).json("weight record added");
   })
//access current user goal data  
user.route('/goal')

router.post('/newGoal', (req,res) => {
    res.send('Goal data recieved')
     
    let exerciseType = req.body.exerciseType
    let target = req.
    console.log(target)
    //Goal.add();
    // console.log(res)
  })


export default router;

