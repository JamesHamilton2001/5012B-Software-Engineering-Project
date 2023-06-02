import * as api from './api.js';
import * as ui from './ui.js';
import * as exercise from './exercise.js';

export const types = await api.get('/goal');

//create 2 forms, one for weightGoal, one for exerciseGoal
export async function createWeightGoalForm() {

  //create form
  const form = document.createElement("form");
  //set form attributes
  form.id = 'weightGoal';
  // form.setAttribute("action", "/api/goal");
  // form.setAttribute("method", "post");

  const fieldset = form.appendChild(document.createElement('fieldset'));

  const legend = fieldset.appendChild(document.createElement('legend'));
  legend.textContent = 'New Weight Goal';


  const target = fieldset.appendChild(ui.createNumericInput());
  target.id = 'weightTarget';

  const endTime = fieldset.appendChild(document.createElement('input'))
  endTime.id = 'weightEndTime';
  endTime.type = 'date'
  endTime.name = 'endTime'

  form.getData = () => {
    return {
       target: parseInt(target.value),
       endTime: endTime.value
    };
 };

  const submit = fieldset.appendChild(document.createElement('input'))
  submit.id = 'newWeightGoal'
  submit.type = 'submit'
  submit.value = 'Create Goal'


  submit.addEventListener('click', async () => {
    // Disable changes to prevent e.g. multiple submissions
      fieldset.disabled = true;
      // Send the data to the API
      const response = await api.post('goal', form.getData());
      // TODO: handle response better than just logging
      console.log(response);
      // TODO: go fix the api.post() function to return a better object (e.g. include status, etc?)
      const message = document.createElement('p');
      message.textContent = 'Goal added successfully!';
      form.replaceWith(message);
   });

  return form;
  

}

export async function createExerciseGoalForm() {
  //create 2 forms, one for weightGoal, one for exerciseGoal
  const form = document.createElement("form");
  form.id = 'exerciseGoal';
  // form.setAttribute("action", "/api/goal");
  // form.setAttribute("method", "post");

  const fieldset = form.appendChild(document.createElement('fieldset'));

  const legend = fieldset.appendChild(document.createElement('legend'));
  legend.textContent = 'New Exercise Goal';

  const target = fieldset.appendChild(exercise.createFieldset());
  target.id = 'exerciseTarget';

  const endTime = fieldset.appendChild(document.createElement('input'))
  endTime.id = 'exerciseEndTime';
  endTime.type = 'date'
  endTime.name = 'endTime'

  form.getData = () => {
    return {
       target: target.getData(),
       endTime: endTime.value,
    };
 };
  
  const submit = fieldset.appendChild(document.createElement('input'))
  submit.id = 'newExerciseGoal'
  submit.type = 'submit'
  submit.value = 'Create Goal'

  submit.addEventListener('click', async () => {
    // Disable changes to prevent e.g. multiple submissions
      fieldset.disabled = true;
      // Send the data to the API
      const response = await api.post('goal', form.getData());
      // TODO: handle response better than just logging
      console.log(response);
      // TODO: go fix the api.post() function to return a better object (e.g. include status, etc?)
      const message = document.createElement('p');
      message.textContent = 'Goal added successfully!';
      form.replaceWith(message);
   });

  return form;
  

}

export async function displayGoals() {
  const viewGoal = document.createElement('div');
  const goal = await api.get('goal');
  const display = document.createElement('p');
  display.textContent = goal.value;
  return viewGoal;
}