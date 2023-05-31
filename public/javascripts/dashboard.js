// execute..? this doesn't execute anything; it adds a new script file to the DOM
function executeSelectionScript(name) {
  var script = document.createElement("script");
  script.src = "javascripts/dashboard/" + name + ".js";
  document.head.appendChild(script);
}

const displayElement = document.querySelector('body > main');

// add event listener to each sidebar item, that changes the dashboard display accordingly
document.querySelectorAll('menu > li').forEach((item) => {
 var selection;
 switch(item.id)
 {
   case "slct_stats":    { selection = "stats"; break; }
   case "slct_groups":   { selection = "groups"; break; }
   case "slct_goals":    { selection = "goals"; break; }
   case "slct_exercise": { selection = "exercise"; break; }
   case "slct_meals":    { selection = "meals"; break; }
   case "slct_weight":   { selection = "weight"; break; }
 }

 item.addEventListener('click', () => executeSelectionScript(selection), { once: true });

 item.addEventListener('click', () => {
    // fetch dashboard display html corresponding to sidebar selection
    fetch("/dashboard/" + selection)
      // convert html prototype into text
      .then((response) => { return response.text(); })
      // insert html text into display div inner html and load script
      .then((html) => {
        displayElement.innerHTML = html;
      })
      // catch and log error (if that somehow happens...)
      .catch((error) => { console.error("Unable to load template: ", error); });
 });
});
