
export class ChartManager
{
  constructor() {
    this.chart;  
    this.chartData;
    this.chartOptions;

    const context = document.getElementById("chart_canvas").getContext("2d");

    this.chartData = {
      labels: ["one", "two", "tre", "for"],
      datasets: [{
        label:        "data",
        data:         [1,2,3,4],
        borderColor:  "rgb(0, 255, 0)"
      }, {
        label:        "atad",
        data:         [4,-3,2,-1],
        borderColor:  "rgb(255, 0, 0)"
      }]
    };
    this.chartOptions = {
      scales: {
        x: { grid: { display: false } },
        y: { grid: { display: false } }
      }
    };
    this.chart = new Chart(context, {
      type:    "line",
      data:    this.chartData,
      options: this.chartOptions
    });
  }
}
