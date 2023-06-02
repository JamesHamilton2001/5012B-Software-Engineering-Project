import * as api from './api.js';
import * as ui from './ui.js';
import * as exercise from './exercise.js';

export const types = await api.get('/newGoal');

//create 2 forms, one for weightGoal, one for exerciseGoal
export async function createWeightGoalForm() {

  //create form
  const form = document.createElement("form");
  //set form attributes
  form.id = 'weightGoal';
  form.setAttribute("action", "/api/newGoal");
  form.setAttribute("method", "post");

  const fieldset = form.appendChild(document.createElement('fieldset'));

  const legend = fieldset.appendChild(document.createElement('legend'));
  legend.textContent = 'New Weight Goal';


  const target = fieldset.appendChild(ui.createNumericInput());
  target.id = 'weightTarget';

  const endTime = fieldset.appendChild(document.createElement('input'))
  endTime.id = 'weightEndTime';
  endTime.type = 'date'
  endTime.name = 'endTime'

  const submit = fieldset.appendChild(document.createElement('input'))
  submit.id = 'newWeightGoal'
  submit.type = 'submit'
  submit.value = 'Create Goal'

//   fieldset.getData = () => {
//     return {
//        food_type_id: parseInt(type.value),
//        quantity: parseFloat(quantity.value),
//     };
//  };

  return fieldset;
  

}

export async function createExerciseGoalForm() {
  //create 2 forms, one for weightGoal, one for exerciseGoal
  const form = document.createElement("form");
  form.id = 'exerciseGoal';
  form.setAttribute("action", "/api/newGoal");
  form.setAttribute("method", "post");

  const fieldset = form.appendChild(document.createElement('fieldset'));

  const legend = fieldset.appendChild(document.createElement('legend'));
  legend.textContent = 'New Exercise Goal';

  const target = fieldset.appendChild(exercise.createFieldset());
  target.id = 'weightTarget';

  const endTime = fieldset.appendChild(document.createElement('input'))
  endTime.id = 'exerciseEndTime';
  endTime.type = 'date'
  endTime.name = 'endTime'
//   fieldset.getData = () => {
//     return {
//        food_type_id: parseInt(type.value),
//        quantity: parseFloat(quantity.value),
//     };
//  };

  return fieldset;
  

}