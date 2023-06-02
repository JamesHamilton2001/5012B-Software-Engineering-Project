import * as api from "/js/api.js";
// scales body top padding to match header height
function scaleBodyPaddingTop() {
  document.body.style.paddingTop = `${document.querySelector("header").offsetHeight}px`;
}

// scale body top padding on load and resize
document.addEventListener("DOMContentLoaded", function() {
  scaleBodyPaddingTop();
  window.addEventListener("resize", scaleBodyPaddingTop);
});

async function fetchData() {
  try {
    const Userdata = await api.get("user/");
    //const Userexercise = await api.get("user/exercise");
    //console.log(Userexercise);
    console.log(Userdata.username);
    return String (Userdata.username); // Process the Userdata or assign it to a variable
  } catch (error) {
    console.error(error); // Handle any errors that occur during the request
  }}
document.getElementById("User").textContent += await fetchData() + " !";