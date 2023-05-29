// Frontend utility code for exercise data

import * as api from './api.js';
import * as ui from './ui.js';

export const types = await api.get('exercise/types');


// Constructs a standard widget thing for entering exercise data.
export function createFieldset(cb) {
   const fieldset = document.createElement('fieldset');
   const typeSelect = fieldset.appendChild(ui.createTypeSelect(types, 'Exercise type...', e => {
      metricLabel.textContent = e.selection.metric;
   }));
   const valueInput = fieldset.appendChild(ui.createNumericInput());
   const metricLabel = fieldset.appendChild(document.createElement('span'));

   // Disable the value input box until a type is selected, and focus it so the yser can start typing
   valueInput.disabled = true;
   typeSelect.addEventListener('change', () => {
      valueInput.disabled = false;
      valueInput.focus();
   });

   // Set the unique id attributes for the form elements
   fieldset.id = 'exerciseFieldset';
   typeSelect.id = 'typeSelect';
   valueInput.id = 'valueInput';
   metricLabel.id = 'metricLabel';

   // Finally attach a nice way to extract the data from the fieldset
   // TODO: validate input
   fieldset.getData = () => {
      return {
         type: parseInt(typeSelect.value),
         value: parseFloat(valueInput.value),
      };
   };

   return fieldset;
}

