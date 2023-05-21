function fixDashboardBody() {
  var headerHeight = document.querySelector("header").offsetHeight;
  var windowHeight = window.innerHeight;
  document.body.style.height = (windowHeight - headerHeight) + "px";
}

// on load and resize dashboard body to fit size of screen - header
document.addEventListener("DOMContentLoaded", function()
{
  fixDashboardBody();
  window.addEventListener("resize", fixDashboardBody);
});
