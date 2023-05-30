var chartCanvas;

  // // was having some silly issues with mutation observer, solution for now...
function chartElementExists() {
  if (document.getElementById("weight_chart_canvas")) {
    chartCanvas = document.getElementById("weight_chart_canvas");
    return true;
  }
  else setTimeout(chartElementExists, 128);
}

if (chartElementExists()) {
  const context = chartCanvas.getContext("2d");

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
}