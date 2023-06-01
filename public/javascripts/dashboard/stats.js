import * as api from "/js/api.js";

export class ChartManager
{
  constructor()
  {
    this.chart;
    this.chartData;
    this.chartOptions;
    this.context = document.getElementById("chart_canvas").getContext("2d");

    // no grid lines
    this.chartOptions = {
      scales: {
        x: { grid: { display: false } },
        y: { grid: { display: false } }
      }
    }

    // initialise (line) chart
    this.chart = new Chart(this.context, {
      type:     "line",
      fill:     "origin",
      data:     this.chartData,
      options:  this.chartOptions,
    });
  }

  // set chart information and data, update chart display
  setData(nameStr, xDataArr, yDataArr, colourStr)
  {
    this.chart.data = {
      labels: xDataArr,
      datasets: [{
        label: nameStr,
        data: yDataArr,
        borderColor: colourStr
      }]
    };
    this.chart.update();
  }

  // get user weight data specified by args, formats and graph data into chart
  async graphWeight(startDate, endDate, entryLimit, utsOffset)
  {
    // get entries, only provide api args if argc > 0, reverse to make ascending by uts/date
    const entries = ((!startDate && !endDate && !entryLimit && !utsOffset)
        ? await api.get("user/weight")
        : await api.get("user/weight", { start: startDate, end: endDate, limit: entryLimit, offset: utsOffset })
    ).reverse();
    
    // just weight values
    const valueArr = entries.map(entry => entry.weight);

    // just UTSs as dd/mm/yy strings
    const dateStrArr = entries.map(entry => {
      const date = new Date(entry.timestamp * 1000);
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth()+1).padStart(2, "0");
      const yy = String(date.getYear()).slice(-2);
      return `${dd}/${mm}/${yy}`;
    });

    // set data into graph and update
    this.setData("Weight", dateStrArr, valueArr, "rgb(0, 255, 0)");
  }
}
