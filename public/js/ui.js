// UI widgets and utility shit

// Generate a selection box suitable to selecting exercise/meal/food types.
export function createTypeSelect(types, placeholder, callback) {
   const sel = document.createElement('select');
   const ph = sel.appendChild(new Option(placeholder, 0, true, true));
   sel.append(...types.map(t => new Option(t.name, t.id, false, false)));

   // Hide the placeholder option from the actual dropdown box/list
   sel.addEventListener('click', () => ph.style.display = 'none');

   // Dispose of the placeholder option once a selection is made
   sel.addEventListener('change', e => e.target.remove(0), {once: true});
   sel.addEventListener('change', e => e.selection = types.find(x => x.id == sel.value));
   sel.addEventListener('change', callback);
   return sel;
};
