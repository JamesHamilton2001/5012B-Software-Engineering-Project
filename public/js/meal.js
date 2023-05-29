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

   const type = fieldset.appendChild(ui.createTypeSelect(await api.get('meal/types'), 'Meal type...'));
   type.id = 'mealType';

   const typeLabel = fieldset.appendChild(document.createElement('label'));
   typeLabel.textContent = 'Meal type';
   typeLabel.htmlFor = type.id;

   const addItem = fieldset.appendChild(document.createElement('button'));
   addItem.type = 'button';
   addItem.classList.add('addItem');
   addItem.textContent = 'Add item';
   // TODO: perhaps add logic to allow only one 'unifished' item at a time?
   addItem.addEventListener('click', async () => fieldset.insertBefore(await createItemFieldset(), addItem));

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

