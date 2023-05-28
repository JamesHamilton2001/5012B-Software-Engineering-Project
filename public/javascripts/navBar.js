// scales body top padding to match header height
function scaleBodyPaddingTop() {
  document.body.style.paddingTop = `${document.querySelector("header").offsetHeight}px`;
}

// scale body top padding on load and resize
document.addEventListener("DOMContentLoaded", function() {
  scaleBodyPaddingTop();
  window.addEventListener("resize", scaleBodyPaddingTop);
});
