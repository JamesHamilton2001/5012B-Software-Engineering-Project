import * as api from "/js/api.js";

// gets data entries from a given path, abiding by the given arguments
async function getEntries(path, startDate, endDate, entryLimit, utsOffset, defaultArgs)
{
  return ((startDate===undefined && endDate===undefined &&
           entryLimit===undefined && utsOffset===undefined)
    ? ((defaultArgs === undefined))
      ? await api.get(path)
      : await api.get(path, defaultArgs)
    : await api.get(path, {
        start: startDate, end: endDate, limit: entryLimit, offset: utsOffset
      })
    ).reverse();
}

// returns entries timestamps in dd/mm/yy string array
function getDateStrings(entries)
{
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

    // initialise as line chart, no grid lines, x lables render sideways
    this.chart = new Chart(this.context, {
      type: "line",
      options:{
        scales: {
          x: {
            grid: { display: false },
            ticks: { minRotation: 90, maxRotation: 90 },
          },
          y: {
            grid: { display: false },
          }
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

  // get user weights specified by args, formats and graph data into chart
  async graphWeight(startDate, endDate, entryLimit, utsOffset)
  {
    // get entries according to args
    const entries = await getEntries("user/weight", startDate, endDate, entryLimit, utsOffset);

    // get values and dates
    const valueArr = entries.map(entry => entry.weight);
    const dateStrArr = getDateStrings(entries);

    // set data into graph and update
    this.setData("Weight", dateStrArr, valueArr, "rgb(0, 255, 0)");
  }

  // get user exercise sessions specified by args, formats and graph data into chart
  async graphExercise(type_id, startDate, endDate, entryLimit, utsOffset)
  {
    // get entries according to args
      // undefined type_id handled downstream, default type_id to 1, needed to fetch users data
    const entries = await getEntries("exercise", startDate, endDate, entryLimit, utsOffset, { type: 1 });

    // get values and dates
    const valueArr = entries.map(entry => entry.value);
    const dateStrArr = getDateStrings(entries);

    // set data into graph and update
    this.setData(entries[0].type, dateStrArr, valueArr, "rgb(0, 255, 0)");
  }

  async graphCalories(startDate, endDate, entryLimit, utsOffset)
  {
    // get entries according to args, reverse order
    const entries = await getEntries("meal", startDate, endDate, entryLimit, utsOffset);
    
    // get calories from meals, get dates
    const valueArr = entries.map(entry => {
      var cals = 0;
      entry.items.forEach(item => { cals += item.calories });
      return cals;
    });
    const dateStrArr = getDateStrings(entries);
    
    // set data into graph and update
    this.setData("Calorie Intake", dateStrArr, valueArr, "rgb(0, 255, 0)");
  }
  
  async graphGoalProgress(startDate, endDate, entryLimit, utsOffset)
  {

  }
}
