
// init display element for other dashboard scripts to access
var displayElement;

// will fix size of dashboard body to only take up available space. no scrolling!
function fixDashboardBody() {
  var headerHeight = document.querySelector("header").offsetHeight;
  var windowHeight = window.innerHeight;
  document.body.style.height = (windowHeight - headerHeight) + "px";
}

function executeSelectionScript(name) {
  var script = document.createElement("script");
  script.src = "javascripts/dashboard/" + name + ".js";
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {

  displayElement = document.getElementById("display");

  // fix dashboard body size to fit screen - header, do so on resize
  fixDashboardBody();
  window.addEventListener("resize", fixDashboardBody);

  // add event listener to each sidebar item, that changes the dashboard display accordingly
  document.querySelectorAll(".sideBarItem").forEach((item) => {
    item.addEventListener("mousedown", function() {
      
      var selection;
      switch(this.id)
      {
        case "slct_stats":    { selection = "stats"; break; }
        case "slct_groups":   { selection = "groups"; break; }
        case "slct_goals":    { selection = "goals"; break; }
        case "slct_exercise": { selection = "exercise"; break; }
        case "slct_meals":    { selection = "meals"; break; }
        case "slct_weight":   { selection = "weight"; break; }
      }

      // fetch dashboard display html corresponding to sidebar selection
      fetch("/dashboard/" + selection)

        // convert html prototype into text
        .then((response) => { return response.text(); })

        // insert html text into display div inner html and load script
        .then((html) => {
          document.querySelector("#display").innerHTML = html;
          executeSelectionScript(selection);
        })

        // catch and log error (if that somehow happens...)
        .catch((error) => { console.error("Unable to load template: ", error); });
    });
  });
});
