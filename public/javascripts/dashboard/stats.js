import * as api from "/js/api.js";

function getDateStrings(entries) {
  return entries.map(entry => {
    const date = new Date(entry.timestamp * 1000);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth()+1).padStart(2, "0");
    const yy = String(date.getYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  });
}

export class ChartManager
{
  constructor()
  {
    // attributes
    this.chart;
    this.chartData;
    this.chartOptions;
    this.context = document.getElementById("chart_canvas").getContext("2d");

    // no grid lines, render x labels sideways
    this.chartOptions = {
      scales: {
        x: { grid: { display: false }, ticks:{ minRotation: 90, maxRotation: 90 }, },
        y: { grid: { display: false }, }
      }
    }

    // initialise as line chart, no grid lines, x lables render sideways
    this.chart = new Chart(this.context, {
      type: "line",
      options:{ scales: {
          x: { grid: { display: false }, ticks:{ minRotation: 90, maxRotation: 90 }, },
          y: { grid: { display: false }, }
        }
      }
    });
  }

  // set chart information and data, update chart display
  setData(nameStr, xDataArr, yDataArr, lineColourStr)
  {
    this.chart.data = {};
    this.chart.data = {
      labels: xDataArr,
      datasets: [{
        label:        nameStr,
        data:         yDataArr,
        borderColor:  lineColourStr,
        fill:         "origin"
      }]
    };
    this.chart.update();
  }

  // get user weight data specified by args, formats and graph data into chart
  async graphWeight(startDate, endDate, entryLimit, utsOffset)
  {
    // get entries according to args, reverse order
    const entries = ((!startDate && !endDate && !entryLimit && !utsOffset)
        ? await api.get("user/weight")
        : await api.get("user/weight", { start: startDate, end: endDate, limit: entryLimit, offset: utsOffset })
    ).reverse();

    // get values and dates
    const valueArr = entries.map(entry => entry.weight);
    const dateStrArr = getDateStrings(entries);

    // set data into graph and update
    this.setData("Weight", dateStrArr, valueArr, "rgb(0, 255, 0)");
  }

  async graphExercise(type_id, startDate, endDate, entryLimit, utsOffset)
  {
    // get entries according to args, reverse order
    const entries = ((startDate===undefined && endDate===undefined && entryLimit===undefined && utsOffset===undefined)
      ? await api.get("exercise", { type: 1 })
      : await api.get("exercise", { type: type_id, start: startDate, end: endDate, limit: entryLimit, offset: utsOffset })
    ).reverse();
    
    // get values and dates
    const valueArr = entries.map(entry => entry.value);
    const dateStrArr = getDateStrings(entries);
    // const dateStrArr = entries.map(entry => new Date(entry.timestamp * 1000));

    // set data into graph and update
    this.setData(entries[0].type, dateStrArr, valueArr, "rgb(0, 255, 0)");
  }
}
