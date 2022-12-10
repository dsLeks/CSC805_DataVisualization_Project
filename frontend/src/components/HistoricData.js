import React, { useEffect, useState } from "react";
var d3 = require("d3");
import "../css/Component.css";
const HistoricData = () => {
  var deathRate = [
    [1999, 4.38],
    [2000, 4.74],
    [2001, 5.2],
    [2002, 5.59],
    [2003, 6.1],
    [2004, 6.63],
    [2005, 7.16],
    [2006, 7.77],
    [2007, 8.41],
    [2008, 9.07],
    [2009, 9.76],
    [2010, 10.53],
    [2011, 11.31],
    [2012, 12.16],
    [2013, 13.01],
    [2014, 13.86],
    [2015, 14.7],
  ];

  useEffect(() => {
    drawChart();
  });

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //Creating mouseOver functionality
  let mouseOver = function (d) {
    d3.selectAll(".mycircle")
      .transition()
      .style("opacity", 20)
      .style("stroke", "transparent");
    d3.select(this).transition().style("opacity", 1).style("stroke", "black");

    tooltip
      .style("left", d.x + "px")
      .style("top", d.y + "px")
      .style("opacity", 1)
      .style("position", "absolute")
      .style("border", "solid")
      .style("border-radius", "5px")
      .style("background-color", "#ebf8e7")
      .style("padding", "5px")
      .text(
        "Year:" +
          d.target.__data__[0] +
          ", " +
          "Death Rate:" +
          d.target.__data__[1]
      )
      .transition();
  };

  //Creating mouseLeave functionality
  let mouseLeave = function (d) {
    d3.selectAll("path")
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "#CC0000");
    tooltip.transition().style("opacity", 0);
  };

  const drawChart = () => {
    // Step 3
    var svg = d3.select("svg"),
      margin = 200,
      width = svg.attr("width") - margin, //300
      height = svg.attr("height") - margin; //200

    // Step 4
    var xScale = d3.scaleLinear().domain([1998, 2016]).range([0, width]),
      yScale = d3.scaleLinear().domain([0, 20]).range([height, 0]);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // Step 5
    // Title
    svg
      .append("text")
      .attr("x", width / 2 + 100)
      .attr("y", 80)
      .attr("text-anchor", "middle")
      .style("font-family", "Helvetica")
      .style("font-size", 20)
      .text("Death Rate in the United States from 1999 to 2015");

    // X label
    svg
      .append("text")
      .attr("x", width / 2 + 100)
      .attr("y", height - 15 + 180)
      .attr("text-anchor", "middle")
      .style("font-family", "Helvetica")
      .style("font-size", 20)
      .text("Years");

    // Y label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(35," + 350 + ")rotate(-90)")
      .style("font-family", "Helvetica")
      .style("font-size", 20)
      .text("Death Rate");

    // Step 6
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", 20)
      .call(d3.axisBottom(xScale));

    g.append("g").style("font-size", 20).call(d3.axisLeft(yScale));

    // Step 7
    svg
      .append("g")
      .selectAll("dot")
      .data(deathRate)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d[0]);
      })
      .attr("cy", function (d) {
        return yScale(d[1]);
      })
      .attr("r", 10)
      .attr("class", "mycircle")
      .attr("stroke", "#CC0000")
      .attr("stroke-width", 3)
      .attr("transform", "translate(" + 100 + "," + 100 + ")")
      .style("fill", "#CC0000")
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave);

    // Step 8
    var line = d3
      .line()
      .x(function (d) {
        return xScale(d[0]);
      })
      .y(function (d) {
        return yScale(d[1]);
      })
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(deathRate)
      .attr("class", "line")
      .attr("transform", "translate(" + 100 + "," + 100 + ")")
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "#CC0000")
      .style("stroke-width", "4");
  };

  return (
    <>
      <div className="heading">
        <h1 id="title">Drug Poisoning Mortality Rate</h1>
        <h2 id="description">USA Historic Data Per Year</h2>
      </div>
      <div className="home-container">
        <div className="svgs">
          <svg width="1400" height="700"></svg>
        </div>
      </div>
    </>
  );
};

export default HistoricData;
