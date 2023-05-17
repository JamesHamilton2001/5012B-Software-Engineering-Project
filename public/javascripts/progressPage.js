
document.addEventListener("DOMContentLoaded", function() {
  const context = document.getElementById("progressChart").getContext("2d");
  const chart = new Chart(context, {
    type: "line",
    data: {
      labels: ["one","two","three","four"],
      datasets: [{
        label: "data",
        data: [1,2,3,4],
        fill: true,
        borderColor: "rgb(0, 255, 0)"
      }, {
        label: "atad",
        data: [4,3,2,1],
        fill: true,
        borderColor: "rgb(255, 0, 0)"
      }]
    },
    options: {
      //  come back and figure customising stuff
    }

  })
});