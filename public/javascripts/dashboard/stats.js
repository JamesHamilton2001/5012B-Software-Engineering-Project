import Chart from "https://esm.run/chart.js/auto";

import * as api from "/js/api.js";


// returns specified data in { x:xVal, y:yVal } array
  //  if not a single arg for start/end/limit/offset
  //    use defaultArgs if given, otherwise provide none
  //  otherwise, use given arguments, validaiton of which handled downstream
const getData = async (path, mapFunc, start, end, limit, offset, defaultArgs) => (
  (start===undefined && end===undefined && limit===undefined && offset===undefined)
    ? ((defaultArgs===undefined))
      ? await api.get(path)
      : await api.get(path, defaultArgs)
    : await api.get(path, { start: start, end: end, limit: limit, offset: offset })
).reverse().map(mapFunc);

// returns a DD/MM/YY string from a given date object
const DateToString = (date) => `
  ${String(date.getDate()).padStart(2,"0")}/
  ${String(date.getMonth()+1).padStart(2,"0")}/
  ${String(date.getYear()).slice(-2)}
`;

export class ChartManager
{
  constructor()
  {
    this.chart;
    this.chartData;
    this.chartOptions;
    this.context = document.getElementById("chart_canvas").getContext("2d");

    // initialise as line chart, no grid lines, x lables render sideways
    this.chart = new Chart(this.context, {
      type: "scatter",
      options:{
        scales: {
          x: {
            // set x axis labels to be displayed at 90 degrees in dd/mm/yy format
            ticks: {
              callback: (value, index, values) => {
                const date = new Date(value * 1000);
                return `${date.getDate()}/${date.getMonth()+1}/${date.getYear().toString().slice(-2)}`;
              },
              minRotation: 90, maxRotation: 90,
            },
          },
        },
      }
    });
  }

  setData(nameStr, data)
  {
    this.chart.data = {};
    this.chart.data = {
      datasets: [{
        label:        nameStr,
        data:         data,
        borderColor:  "rgb(0, 255, 0)",
        fill:         "origin"
      }]
    };
    this.chart.update();
  }

  async graphWeight(start, end, limit, offset)
  {
    this.setData("Weight", await getData(
      "user/weight",
      entry => ({ x: entry.timestamp, y: entry.weight }),
      start, end, limit, offset
    ));
  }

  async graphExercise(type_id, start, end, limit, offset)
  {
    if (type_id===undefined) type_id = 1;
    this.setData("Exercise", await getData(
      "exercise",
      entry => ({ x: entry.timestamp, y: entry.value }),
      start, end, limit, offset,
      { type: type_id }
    ));
  }

  async graphCalories(start, end, limit, offset)
  {
    this.setData("Calories", await getData(
      "meal",
      entry => ({ x: entry.timestamp, y: entry.items.reduce((sum, item) => sum + item.calories, 0) }),
      start, end, limit, offset
    ));
  }

  async graphGoal()
  {
    const data = await api.get("goal", { exercise_type_id: 1 });
    console.log(data);
  }
}