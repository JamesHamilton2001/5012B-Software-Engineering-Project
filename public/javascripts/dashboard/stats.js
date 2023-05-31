console.log("fml");
export default class StatsChartHandler
{
  constructor()
  {
    this.canvas;
    this.chartData;
    this.chartOptions;
    this.chart;

    this.canvas = document.getElementById("chart_canvas");

    if (this.canvas.getContext) {
      const context = this.canvas.getContext("2d");

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
        type: "line",
        data: this.chartData,
        options: this.chartOptions
      });
    }
    else {
      console.error("dashboard/stats.js unable to access chart canvas");
    }
  }
}

var statsChartHandler = new StatsChartHandler();
