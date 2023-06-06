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
export function createNumericInput(min = Number.MIN_VALUE, max = Number.MAX_VALUE, unit = '') {
   const input = document.createElement('input');

   // Set a default 'size' for the input, as this is apparently necessary for correct scaling
   input.size = 1;

   // Default to required for form validation checking & reporting
   input.required = true;

   // Instruct e.g. phones to display a numeric keypad.
   input.setAttribute('inputmode', 'decimal');

   // Reasonably accurate regex to match a decimal
   input.pattern = /^-?\d*\.?\d+$/.toString().slice(1, -1);

   // Attempt to prevent non-numeric input
   input.addEventListener('input', () => {
      // TODO: see if it's possible to stop this jumping the cursor to the end of the input
      input.value = input.value
         .replaceAll(/[^\d.-]|(?<=\.)\./g, '')
         .replace(/^(-?\d*\.\d+)(\.)(\d*)/, '$1$3')
         .replace(/^(.+)(-)(.*)/, '$1$3')
   });

   // Validate input against min/max values, split out for multiple event types
   function validateMinMax() {
      const v = input.getData();;
      if(v > max) {
         input.setCustomValidity(`Value must be ${max}${unit} or less`);
         input.reportValidity();
      }
      if(v < min) {
         input.setCustomValidity(`Value must be ${min}${unit} or more`);
         input.reportValidity();
      }
   }

   // Validate input against min/max values
   input.addEventListener('change', validateMinMax);
   input.addEventListener('focusout', validateMinMax);

   // Overridable function to get the input value, enabling e.g. unit conversion
   input.getData = () => parseFloat(input.value);

   return input;
};

