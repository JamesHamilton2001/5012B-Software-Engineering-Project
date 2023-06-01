// This module responds to all requests to the /api route, and is reponsible for
// sending out JSON data to the client on request.
import express from 'express';

import Exercise from './model/Exercise.js';
import Meal from './model/Meal.js';
import User from './model/User.js';
import Goal from './model/Goal.js';

const router = express.Router();


// Test the top level /api route
// TODO: remove this route. respond instead with some error code
router.get('/', (req, res) => {
   res.json({message: 'Hello from the API!'});
});


// Route availability checks before authentication, as it has to be possible
// when not logged in.
router.get('/user/availableUsername/:username', async (req, res) => {
   res.json(await User.availableUsername(req.params.username));
});

router.get('/user/availableEmail/:email', async (req, res) => {
   res.json(await User.availableEmail(req.params.email));
});


// Error if there is no user logged in.
router.use((req, res, next) => {
   if(!req.user) {
      res.status(401).json({error: 'No user logged in.'});
      return;
   }
   next();
});


// Route User-related API requests to a dedicated sub-router
const user = express.Router();
router.use('/user', user);


// Returns the currently logged in user, or null if no user is logged in.
user.get('/', (req, res) => {
   res.json(req.user);
});


// Access the current user's weight data.
user.route('/weight')
   // Return weight data for the currently logged in user.
   .get(async (req, res) => {
      const data = await req.user.getWeight(req.query.start, req.query.end, req.query.limit, req.query.offset);
      res.json(data);
   })
   // Add a new weight record for the currently logged in user.
   .post(async (req, res) => {
      const data = await req.user.addWeight(req.body.weight, Math.floor(Date.now() / 1000));
      res.status(201).json("weight record added");
   })

//help needed here
//access current user goal data  
router.route('/newGoal')
  .post(async (req,res) => {
    
    console.log("Exercise Type: " + req.body.exerciseType)
    console.log("End time: " + req.body.endTime)
    console.log("Target: " + req.body.target)
    //goalType = req.
    const data = await Goal.add(req.user.id, req.body.exerciseType, req.body.target, req.body.endTime );
    //res.status(201).json("goal record added");
    res.json(data);
    return;
})


// Access the current user's exercise data.
router.route('/exercise')
   .get(async (req, res) => {
      const data = await req.user.getExercise(req.query.start, req.query.end, req.query.limit, req.query.offset);
      res.json(data);
   })
   .post(async (req, res) => {
      const data = await Exercise.add(req.user.id, req.body.type, req.body.value);
      // TODO: check for errors
      res.status(201).json("exercise record added");
   })


// Get a list of all the exercise types currently in the database.
router.get('/exercise/types', async (req, res) => {
   const data = await Exercise.getTypes();
   res.json(data);
});


// Get a list of all the meal types currently in the database.
router.get('/meal/types', async (req, res) => {
   const data = await Meal.getTypes();
   res.json(data);
});


// Get a list of all the food types currently in the database.
router.get('/meal/foodTypes', async (req, res) => {
   const data = await Meal.Item.getTypes();
   res.json(data);
});


// Access the current user's meal data.
router.route('/meal')
   // Return a list of meal records for the logged in user.
   .get(async (req, res) => {
      const data = await Meal.getByUserID(req.user.id, req.query.start, req.query.end, req.query.limit, req.query.offset);
      res.json(data);
   })
   // Insert a new meal record into the database for the logged in user.
   .post(async (req, res) => {
      const meal = await Meal.add(req.user.id, req.body.meal_type_id, req.body.timestamp);
      req.body.items?.forEach(i => {
         if('food_type_id' in i && 'quantity' in i)
            meal.addItem(i.food_type_id, i.quantity);
         else if('name' in i && 'calories' in i)
            meal.addCustom(i.name, i.calories);
      });
      res.status(201).json(meal);
   })


export default router;

