// Frontend utility code for weight data

import * as api from './api.js';
import * as ui from './ui.js';

// Conversion constants
const KG_PER_LB = 0.45359237;
const LB_PER_KG = 1 / KG_PER_LB;

// Create a complete form for entering a new weight entry.
export async function createForm() {
   const form = document.createElement('form');

   const fieldset = form.appendChild(document.createElement('fieldset'));
   

   const legend = fieldset.appendChild(document.createElement('legend'));
   legend.textContent = 'New Weight';

   const value = fieldset.appendChild(ui.createNumericInput(20, 635));
   value.classList.add('value');
   value.required = true;

   const metricSelect = fieldset.appendChild(document.createElement('select'));
   metricSelect.classList.add('metric');
   metricSelect.appendChild(new Option('kg', 'kg', true, true));
   metricSelect.appendChild(new Option('lb', 'lb', false, false));

   // Unit cconversion logic
   metricSelect.addEventListener('change', () => {
      if(!value.value)
         return;
      if(metricSelect.value == 'kg')
         value.value = (value.value * KG_PER_LB).toFixed(2);
      else
         value.value = (value.value * LB_PER_KG).toFixed(2);
   });

   // Block return key.
   // TODO: route to submit.
   form.addEventListener('keypress', e => {
      if(e.key == 'Enter')
         e.preventDefault();
   });

   // Return data suitable for POSTing to the JSON API.
   form.getData = () => {
      let weight = parseFloat(value.value);
      if(metricSelect.value == 'lb')
         weight *= KG_PER_LB;
      return { weight };
   };

   // Add a button to the form to submit the data to the API.
   const submit = form.appendChild(document.createElement('button'));
   submit.type = 'button';
   submit.classList.add('addWeight');
   submit.textContent = 'Add Weight';
   submit.addEventListener('click', async () => {
      // Short circuit out if the form is invalid
      if(!form.checkValidity())
         return form.reportValidity();

      // Disable changes to prevent e.g. multiple submissions
      fieldset.disabled = true;

      // Send the data to the API
      // TODO: handle response better than just logging!
      const response = await api.post('user/weight', form.getData());

      const message = document.createElement('p');
      message.textContent = response;
      form.replaceWith(message);
   });

   return form;
}

