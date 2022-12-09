import React, { useRef, useEffect, useState } from "react";
var d3 = require("d3");
import geojsonData from "../data/geojsonData.json";
import countyData from "../data/countyData.json";
import "../css/Component.css";

const PopulationMap = () => {
  const years = [
    1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
    2011, 2012, 2013, 2014, 2015,
  ];

  const geoData = geojsonData;
  const height = 650;
  const width = 1000;
  const svgRef = useRef();

  const projRef = useRef(
    d3
      .geoAlbersUsa()
      .scale(1200)
      .translate([width / 2, height / 2.2])
  );

  // useState hook to store the selected year as initial value
  const [selectedYear, setSelectedYear] = useState("1999");
  const [selectedOption, setSelectedOption] = useState("deathRateDropdown");
  const [tooltipData, setTooltipData] = useState([]);
  const [deathRateRange, setDeathRateRange] = useState([40, 0]);
  const [populationRange, setPopulationRange] = useState([10000000000, 0]);

  // color scale for population and death rate
  const colorScalePopulation = d3
    .scaleSequential(d3.schemeGreens[3])
    .domain([0, 1000000]);
  const colorScaleDeathrate = d3
    .scaleSequential(d3.schemeOranges[3])
    .domain([0, 15]);

  // to display on tooltip
  const getText = (props) => {
    let text = "";
    console.log(props);
    console.log(tooltipData);
    tooltipData.forEach((element) => {
      if (element["StateFIPS"] == props.STATEFP) {
        if (selectedOption === "populationDropdown")
          text =
            element["stateName"] + "," + " Population:" + element.population;
        else
          text =
            element["stateName"] + "," + " Death Rate:" + element.deathRate;
      }
      return "white";
    });
    return text;
  };
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
      .text(getText(d.target.__data__.properties))
      .transition()
      .duration(300);
  };

  //Creating mouseLeave functionality
  let mouseLeave = function (d) {
    d3.selectAll("path")
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "white");
    tooltip.transition().duration(300).style("opacity", 0);
  };

  //Creating a function to get the data for a particular year
  const dataPerYear = (year, data) => {
    deathRateRange[0] = 40;
    deathRateRange[1] = 0;
    populationRange[0] = 1000000000;
    populationRange[1] = 0;

    const yearWiseData = data.filter((d) => {
      return d.Year == year;
    });

    const stateFips = [];
    const statewiseData = [];
    const stateNames = [];
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
      if (!stateNames.includes(element["State"])) {
        stateNames.push(element["State"]);
      }

      deathRateRange[0] = Math.min(deathRateRange[0], element.deathRate);
      deathRateRange[1] = Math.max(deathRateRange[1], element.deathRate);
      populationRange[0] = Math.min(populationRange[0], element.Population);
      populationRange[1] = Math.max(populationRange[1], element.Population);
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
        deathRate: (sum / stateData.length).toFixed(2),
        population: totalpopulation,
        year: year,
        stateName: stateNames[stateFips.indexOf(element)],
      };
      statewiseData.push(state);
    });

    return statewiseData;
  };

  // useEffect hook to draw the choropleth map
  useEffect(() => {
    const yearWiseData = dataPerYear(selectedYear, countyData);
    tooltipData.splice(0, tooltipData.length);
    tooltipData.push(...yearWiseData);

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
              .attr("stroke", "white")
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
      <div className="heading">
        <h1 id="title">Drug Poisoning Mortality Rate</h1>
        <h2 id="description">USA State Map</h2>
      </div>
      <div className="home-container">
        <div className="svgs">
          <svg ref={svgRef} style={{ border: "2px solid gold" }}></svg>
          <h5 className="legendHeading">Range Distribution</h5>
          <div className="legend">
            <div className="leftLegend">
              {selectedOption === "deathRateDropdown"
                ? deathRateRange[0]
                : populationRange[0]}
            </div>
            <div className="legendBar">
              <svg style={{ height: "20", width: "800" }}>
                <defs>
                  <linearGradient
                    id="linear-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    {selectedOption === "deathRateDropdown" ? (
                      <>
                        <stop offset="0%" stopColor="#fee6ce"></stop>
                        <stop offset="50%" stopColor="#fdae6b"></stop>
                        <stop offset="100%" stopColor="#f03b20"></stop>{" "}
                      </>
                    ) : (
                      <>
                        <stop offset="0%" stopColor="#eaf9e5"></stop>
                        <stop offset="50%" stopColor="#6ac263"></stop>
                        <stop offset="100%" stopColor="#001f00"></stop>
                      </>
                    )}
                  </linearGradient>
                </defs>

                <rect
                  width="800"
                  height="20"
                  fill="url(#linear-gradient)"
                ></rect>
              </svg>
            </div>
            <div className="rightLegend">
              {selectedOption === "deathRateDropdown"
                ? deathRateRange[1]
                : populationRange[1]}
            </div>
          </div>
        </div>

        <div className="base-container">
          <h2 id="filters">Please Select Below Filter</h2>
          <div className="dropdownTag">
            <select onChange={changeSelectOptionHandler} className="chooseYear">
              {years.map((element) => (
                <option value={element}>{element}</option>
              ))}
            </select>
            <br />
            <br />
            <select onChange={selectOptionHandler} className="chooseOption">
              <option value="deathRateDropdown">Death Rate</option>
              <option value="populationDropdown">Population</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopulationMap;
