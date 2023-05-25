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
function createForm() {
   const form = document.createElement('form');
   const metricLabel = document.createElement('span');
   const typeSelect = form.appendChild(createTypeSelect(e => {
      metricLabel.textContent = e.exercise.metric;
   }));
   const valueBox = form.appendChild(document.createElement('div'));
   const valueInput = valueBox.appendChild(document.createElement('input'));
   valueBox.append(metricLabel);

   // Disable the value input box until a type is selected
   valueInput.disabled = true;
   typeSelect.addEventListener('change', () => valueInput.disabled = false, {once: true});

   // Set the unique id attributes for the form elements
   form.id = 'exerciseForm';
   typeSelect.id = 'typeSelect';
   valueBox.id = 'valueBox';
   valueInput.id = 'valueInput';
   metricLabel.id = 'metricLabel';
   form.style.border = '1px solid black';
   return form;
}

const cont = document.getElementById('container');
cont.appendChild(createForm());
//cont.appendChild(createTypeSelect(e => {
//   console.log(e.exercise);
//}));

