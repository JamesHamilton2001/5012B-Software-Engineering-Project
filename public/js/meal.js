// Frontend utility code for exercise data

import * as api from './api.js';
import * as ui from './ui.js';

// Create a complete form for entering a new meal entry.
export async function createMealForm() {
   const form = document.createElement('form');
   form.id = 'mealForm';

   const fieldset = form.appendChild(document.createElement('fieldset'));

   const legend = fieldset.appendChild(document.createElement('legend'));
   legend.textContent = 'New Meal';
   legend.id = 'newMeal';

   const type = fieldset.appendChild(ui.createTypeSelect(await api.get('meal/types'), 'Meal type...'));
   type.id = 'mealType';

   const typeLabel = fieldset.appendChild(document.createElement('label'));
   typeLabel.textContent = 'Meal type';
   typeLabel.htmlFor = type.id;
   typeLabel.id = 'mealLabel';

   const addItem = fieldset.appendChild(document.createElement('button'));
   addItem.type = 'button';
   addItem.classList.add('addItem');
   addItem.textContent = 'Add item';
   addItem.id = 'addItemBut';
   // TODO: perhaps add logic to allow only one 'unifished' item at a time?
   addItem.addEventListener('click', async () => fieldset.insertBefore(await createItemFieldset(), addItem));

   // Return data suitable for POSTing to the JSON API.
   // TODO: validate input?
   form.getData = () => {
      return {
         meal_type_id: parseInt(type.value),
         items: Array.from(form.getElementsByClassName('mealItem')).map(x => x.getData()),
      };
   };

   // Add a button to the form to submit the data to the API.
   const submit = fieldset.appendChild(document.createElement('button'));
   submit.type = 'button';
   submit.classList.add('addMeal');
   submit.textContent = 'Add Meal';
   submit.id = 'addMealBut';
   submit.addEventListener('click', async () => {
      // Short circuit out if the form is invalid
      if(!form.checkValidity())
         return form.reportValidity();

      // Disable changes to prevent e.g. multiple submissions
      fieldset.disabled = true;

      // Send the data to the API
      const response = await api.post('meal', form.getData());
      // TODO: handle response better than just logging
      console.log(response);
      // TODO: go fix the api.post() function to return a better object (e.g. include status, etc?)
      const message = document.createElement('p');
      message.textContent = 'Meal added successfully!';
      form.replaceWith(message);
   });

   return form;
}


// Create a new fieldset element representing a single food item for a meal entry.
async function createItemFieldset() {
   const fieldset = document.createElement('fieldset');
   fieldset.classList.add('mealItem');

   const legend = fieldset.appendChild(document.createElement('legend'));
   legend.textContent = 'Food item';

   const type = fieldset.appendChild(ui.createTypeSelect(await api.get('meal/foodTypes'), 'Food type...'));
   type.classList.add('type');

   const quantity = fieldset.appendChild(ui.createNumericInput());
   quantity.classList.add('quantity');
   quantity.required = true;

   const unit = fieldset.appendChild(document.createElement('span'));
   unit.classList.add('unit');
   unit.textContent = 'g';

   const remove = fieldset.appendChild(document.createElement('button'));
   remove.type = 'button';
   remove.classList.add('remove');
   remove.textContent = 'Remove';
   remove.addEventListener('click', () => fieldset.remove(), {once: true});

   // Return data suitable for POSTing to the JSON API.
   // TODO: validate input?
   fieldset.getData = () => {
      return {
         food_type_id: parseInt(type.value),
         quantity: parseFloat(quantity.value),
      };
   };

   return fieldset;
}

