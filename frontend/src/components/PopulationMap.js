import React, { useRef, useEffect, useState } from "react";
var d3 = require("d3");
import geojsonData from "./geojsonData.json";
import countyData from "./countyData.json";
import "../css/PopulationMap.css";

const PopulationMap = () => {
  const years = [1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015]
  
  const geoData = geojsonData;
  const height = 700;
  const width = 1000;
  const svgRef = useRef();
  
  const projRef = useRef(
    d3
      .geoAlbersUsa()
      .scale(1200)
      .translate([width / 2, height / 2.5])
  );

  const [selectedYear, setSelectedYear] = React.useState("1999");
  const [selectedOption, setSelectedOption] =
    React.useState("deathRateDropdown");

  const colorScalePopulation = d3
  .scaleSequential(d3.schemeGreens[3])
  .domain([0,1000000] );
  const colorScaleDeathrate = d3
    .scaleSequential(d3.schemeOranges[3])
    .domain([0, 30]);
  //Adding a tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //Creating mouseOver functionality
  let mouseOver = function (d) {
    d3.selectAll(".State")
      .transition()
      .duration(300)
      .style("opacity", 0.2)
      .style("stroke", "transparent");
    d3.select(this)
      .transition()
      .duration(300)
      .style("opacity", 1)
      .style("stroke", "black");

    tooltip
      .style("left", d.x + "px")
      .style("top", d.y + "px")
      .style("opacity", 1)
      .style("position", "absolute")
      .style("border", "solid")
      .style("border-radius", "5px")
      .style("background-color", "#ebf8e7")
      .style("padding", "5px")
      .text(d.target.__data__.properties.NAME)
      .transition()
      .duration(300);
  };

  //Creating mouseLeave functionality
  let mouseLeave = function (d) {
    d3.selectAll("path")
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "none");
    tooltip.transition().duration(300).style("opacity", 0);
  };

  const dataPerYear = (year, data) => {
    const yearWiseData = data.filter((d) => {
      if (!years.includes(d["Year"])) {
        years.push(d["Year"]);
      }
      return d.Year == year;
    });
    //sort years for dropdown
    years.sort();
    console.log(years);
    const stateFips = [];
    const statewiseData = [];
    yearWiseData.forEach((element) => {
      const deathRate =
        element["Estimated Age-adjusted Death Rate, 16 Categories (in ranges)"];
      if (deathRate.includes("-")) {
        const split = deathRate.split("-");
        const start = parseInt(split[0]);
        const end = parseInt(split[1]);
        element.deathRate = (start + end) / 2;
      } else {
        element.deathRate = parseInt(deathRate.substring(1, deathRate.length));
      }
      if (!stateFips.includes(element["FIPS State"])) {
        stateFips.push(element["FIPS State"]);
      }

    });

    stateFips.forEach((element) => {
      const stateData = yearWiseData.filter((d) => {
        return d["FIPS State"] == element;
      });
      let sum = 0;
      stateData.forEach((element) => {
        sum += element.deathRate;
      });
      let totalpopulation = 0;
      stateData.forEach((element) => {
        totalpopulation += parseInt(element.Population);
      });
      const state = {
        StateFIPS: element,
        deathRate: sum / stateData.length,
        population: totalpopulation,
        year: year,
      };
      statewiseData.push(state);
    });
    return statewiseData;
  };

  useEffect(() => {
    console.log("Use Effect");
    const yearWiseData = dataPerYear(selectedYear, countyData);

    var index;
    //Drawing the Choropleth Map - for population
    if (yearWiseData.length > 1 && typeof yearWiseData !== "undefined") {
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height);
      const path = d3.geoPath(projRef.current);
      svg
        .append("g")
        .attr("width", 500)
        .attr("height", 500)
        .selectAll("path")
        .data(geoData.features)
        .join(
          (enter) =>
            enter
              .append("path")
              .attr("d", function (d) {
                return path(d);
              })
              .attr("fill", function (d) {
                var i;
                var d_state_fips = d.properties.STATEFP;
                for (i = 0; i < yearWiseData.length; i++) {
                  if (d_state_fips == yearWiseData[i].StateFIPS) {
                    console.log(selectedOption);

                    if (selectedOption === "deathRateDropdown") {
                      return colorScaleDeathrate(yearWiseData[i].deathRate);
                    } else {
                      return colorScalePopulation(yearWiseData[i].population);
                    }
                  }
                }
              })
              .attr("opacity", "1")
              .attr("data-stateName", function (d) {
                return d.properties.NAME;
              })
              .attr("class", "State")
              .attr("stroke", "none")
              .on("click", function (event, d) {
                const { x, y, width, height } = this.getBBox();
                const state = d3
                  .select(this)
                  .attr(
                    "transform-origin",
                    `${x + width / 2}px ${y + height / 2}px`
                  )
                  .remove();
                svg.append(() => state.node());

                d.properties.expanded = !d.properties.expanded;

                state
                  .transition()
                  .duration(500)
                  .attr(
                    "transform",
                    d.properties.expanded ? "scale(1.25)" : "scale(1)"
                  );
              })
              .on("mouseover", mouseOver)
              .on("mouseleave", mouseLeave),
          (update) => update,
          (exit) => exit.remove()
        );
    } else {
      console.log("yearWiseData is empty");
    }
  }, [selectedYear, selectedOption]);

  const changeSelectOptionHandler = (event) => {
    setSelectedYear(event.target.value);
  };

  const selectOptionHandler = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <>
    <div className="home-container">
      <div className="svgs">
        <svg ref={svgRef}></svg>
        
        <div>
        {selectedOption === "deathRateDropdown" ? 0 : 0}
          <svg style={{height:'20', width: '950'}}>
            <defs>
              <linearGradient
                id="linear-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stop-color="#eaf9e5"></stop>
                <stop offset="80%" stop-color="#6ac263"></stop>
                <stop offset="100%" stop-color="#001f00"></stop>
              </linearGradient>
            </defs>
            
            <rect width="950" height="20" fill="url(#linear-gradient)"></rect>
            
          </svg>
          {selectedOption === "deathRateDropdown" ? 30 : 1000000}
        </div>
      </div>
      <div className="base-container">
        <select onChange={changeSelectOptionHandler} name="chooseYear">
          {years.map((element) => (
            <option value={element}>{element}</option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={selectOptionHandler} name="chooseOption">
          <option value="deathRateDropdown">Death Rate</option>
          <option value="populationDropdown">Population</option>
        </select>
      </div>
    </div>
    </>
  );
};

export default PopulationMap;
