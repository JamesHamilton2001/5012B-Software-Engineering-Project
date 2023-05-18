const userModel = require('../model/User.js');
var express = require('express');
var router = express.Router();

var cWeight = '';
var height = '';

router.get('/', function(req, res, next) {
    res.render('profile',{title: 'Your Profile'})
  });

router.post('/', function(req, res, next){
    cWeight = req.body.cWeight;
    height = req.body.height;
    
    console.log(cWeight);
    console.log(height);

    res.render('profile', {bmi: bmiCalculator(cWeight,height)})
})

function bmiCalculator(cWeight,height){
    return cWeight/((height/100)**2);
}

var bmi = bmiCalculator(cWeight,height);


module.exports = router;
