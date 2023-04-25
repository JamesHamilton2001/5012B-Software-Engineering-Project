import * as d3 from "d3";


const data = [1, 2, 3, 4, 5];

const svg = d3.create("svg")
    .attr("width", 200)
    .attr("height", 200);

const circle = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => d * 30)
    .attr("cy", 100)
    .attr("r", 10);

console.log(svg.node().outerHTML);