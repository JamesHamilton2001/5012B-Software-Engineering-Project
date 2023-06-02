
import * as api from "/js/api.js";
const displayElement = document.querySelector('body > main');

// add event listener to each sidebar item, that changes the dashboard display accordingly
document.querySelectorAll('menu > li').forEach((item) => {
 item.addEventListener('click', () => {
    // fetch dashboard display html corresponding to sidebar selection
    fetch("/dashboard/" + item.dataset.display)
      // convert html prototype into text
      .then(response => response.text())
      // insert html text into display div inner html and load script
      .then(html => {
         const fragment = document.createRange().createContextualFragment(html);
         displayElement.replaceChildren(fragment);
      })
      // catch and log error (if that somehow happens...)
      .catch(error => console.error("Unable to load template: ", error));
 });
});

async function fetchData() {
  try {
    const Userdata = await api.get("user/");
    //const Userexercise = await api.get("user/exercise");
    //console.log(Userexercise);
    console.log(Userdata);
    return String (Userdata.username); // Process the Userdata or assign it to a variable
  } catch (error) {
    console.error(error); // Handle any errors that occur during the request
  }}
document.getElementById("User").textContent += await fetchData() + "!";