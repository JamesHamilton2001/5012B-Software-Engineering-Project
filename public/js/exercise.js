// Frontend utility code for exercise data

import * as api from './api.js';

export const types = await api.get('exercise/types');

export function createTypeSelect(cb) {
   const sel = document.createElement('select');
   const placeholder = sel.appendChild(new Option('Exercise type…', 0, true, true));
   sel.append(...types.map(t => new Option(t.name, t.id, false, false)));

   // Hide the placeholder option from the actual dropdown box/list
   sel.addEventListener('click', () => placeholder.style.display = 'none');

   // Dispose of the placeholder option once a selection is made
   sel.addEventListener('change', e => e.target.remove(0), {once: true});
   sel.addEventListener('change', e => e.exercise = types[sel.value - 1]);
   sel.addEventListener('change', cb);
   return sel;
};


// Constructs a standard widget thing for entering exercise data.
export function createFieldset(cb) {
   const fieldset = document.createElement('fieldset');
   const typeSelect = fieldset.appendChild(createTypeSelect(e => {
      metricLabel.textContent = e.exercise.metric;
   }));
   const valueInput = fieldset.appendChild(document.createElement('input'));
   const metricLabel = fieldset.appendChild(document.createElement('span'));

   // Attempt to prevent non-numeric input
   valueInput.addEventListener('input', () => {
      // TODO: see if it's possible to stop this jumping the cursor to the end of the input
      valueInput.value = valueInput.value.replaceAll(/[^\d.]|(?<=\.)\./g, '');
   });

   // Disable the value input box until a type is selected
   valueInput.disabled = true;
   typeSelect.addEventListener('change', () => valueInput.disabled = false, {once: true});

   // Set the unique id attributes for the form elements
   fieldset.id = 'exerciseFieldset';
   typeSelect.id = 'typeSelect';
   valueInput.id = 'valueInput';
   metricLabel.id = 'metricLabel';

   return fieldset;
}

