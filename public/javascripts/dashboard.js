
var firstDomLoad = true;

// will fix size of dashboard body to only take up available space. no scrolling!
function fixDashboardBody() {
  var headerHeight = document.querySelector("header").offsetHeight;
  var windowHeight = window.innerHeight;
  document.body.style.height = (windowHeight - headerHeight) + "px";
}

document.addEventListener("DOMContentLoaded", () => {

  //  only assign functions on first load: (loads twice, temporary fix)
  if (firstDomLoad) {

    // fix dashboard body size to fit screen - header, do so on resize
    fixDashboardBody();
    window.addEventListener("resize", fixDashboardBody);
  
    // add event listener to each sidebar item, that changes the dashboard display accordingly
    document.querySelectorAll(".sideBarItem").forEach((item) => {
      item.addEventListener("mousedown", function() {

        // fetch dashboard display html corresponding to sidebar selection
        fetch("/dashboard/" + this.getAttribute("display-view"))

          // convert html prototype into text
          .then((response) => { return response.text(); })

          // insert html text into display div inner html
          .then((html) => { document.querySelector("#display").innerHTML = html; })

          // catch and log error (if that somehow happens...)
          .catch((error) => { console.error("Unable to load template: ", error); });
      });
    });

    firstDomLoad = false;
  }
});
