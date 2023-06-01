
export class ChartManager
{
  constructor() {
    this.chart;
    this.chartData;
    this.chartOptions;
    this.context = document.getElementById("chart_canvas").getContext("2d");

    // no grid lines, 
    this.chartOptions = {
      scales: {
        x: { grid: { display: false } },
        y: { grid: { display: false } }
      }
    };
    // initialise (line) chart
    this.chart = new Chart(this.context, {
      type:    "line",
      data:    this.chartData,
      options: this.chartOptions
    });
    this.setData("No Data Loaded to Graph...", [4,2], ["4","2"]);
  }

  // comments itself
  setData(nameStr, xDataArr, yDataArr, colourStr)
  {
    this.chart.data = {
      labels: yDataArr,
      datasets: [{
        label: nameStr,
        data: xDataArr,
        borderColor: colourStr
      }]
    };
    this.chart.update();
  } 
}
