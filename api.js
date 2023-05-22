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


export default router;

