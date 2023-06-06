import * as api from "/js/api.js";

async function fetchData() {
  try {
    const Userdata = await api.get("user/");
    //const Userexercise = await api.get("user/exercise");
    //console.log(Userexercise);
    return String (Userdata.real_name); // Process the Userdata or assign it to a variable
  } catch (error) {
    console.error(error); // Handle any errors that occur during the request
  }}

async function navbarExtraInfo(){
  const currentPage = window.location.pathname;
  switch (currentPage){
    case "/dashboard":
      document.getElementById("User").textContent += await fetchData() + " !";
      break;
    case "/progress":
      document.getElementById("User").textContent = await fetchData() + "'s" + document.getElementById("User").textContent;
      break;
  }
}

navbarExtraInfo();
