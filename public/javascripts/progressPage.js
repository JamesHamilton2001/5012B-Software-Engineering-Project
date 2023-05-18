
document.addEventListener("DOMContentLoaded", function() {
  const context = document.getElementById("progress_chart").getContext("2d");
  const chart = new Chart(context, {

    type: "line",

    data: {
      labels: ["one","two","three","four"],

      datasets: [{
        label:        "data",
        data:         [1,2,3,4],
        borderColor:  "rgb(0, 255, 0)"
      }, {
        label:        "atad",
        data:         [4,-3,2,-1],
        borderColor:  "rgb(255, 0, 0)"
      }]
    },
    
    options: {
      scales: {
        x: { grid: { display: false } },
        y: { grid: { display: false } }
      }
    }
  });
});