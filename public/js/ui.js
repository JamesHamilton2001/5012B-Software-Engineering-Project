// UI widgets and utility shit

// Generate a selection box suitable to selecting exercise/meal/food types.
export function createTypeSelect(types, placeholder, callback) {
   const sel = document.createElement('select');
   const ph = sel.appendChild(new Option(placeholder, '', true, true));
   sel.append(...types.map(t => new Option(t.name, t.id, false, false)));

   // Hide the placeholder option from the actual dropdown box/list
   sel.addEventListener('click', () => ph.style.display = 'none');

   // Dispose of the placeholder option once a selection is made
   sel.addEventListener('change', e => e.target.remove(0), {once: true});
   sel.addEventListener('change', e => e.selection = types.find(x => x.id == sel.value));
   sel.addEventListener('change', callback);

   // Default to required for form validation checking & reporting
   sel.required = true;

   return sel;
};


// Create an inout element which only accepts numeric input.
export function createNumericInput() {
   const input = document.createElement('input');

   // Instruct e.g. phones to display a numeric keypad.
   input.setAttribute('inputmode', 'decimal');

   input.pattern = /^-?\d*\.?\d+$/;

   // TODO: setup built-in html validation

   // Attempt to prevent non-numeric input
   input.addEventListener('input', () => {
      // TODO: see if it's possible to stop this jumping the cursor to the end of the input
      input.value = input.value.replaceAll(/[^\d.]|(?<=\.)\./g, '');
   });

   return input;
};

