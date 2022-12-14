import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "../css/Component.css";
import countyGeoJson from "../data/countiesGeoJson.json";
import countyData from "../data/countyData.json";

const CountyMap = () => {
  const years = [
    1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
    2011, 2012, 2013, 2014, 2015,
  ];
  const stateNames = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const [selectedYear, setSelectedYear] = useState("1999");
  const [selectedOption, setSelectedOption] = useState("deathRateDropdown");
  const [selectedState, setSelectedState] = useState("Alabama");
  const [selectedStateId, setSelectedStateId] = useState("1");
  const [tooltipData, setTooltipData] = useState([]);
  const [deathRateRange, setDeathRateRange] = useState([40, 0]);
  const [populationRange, setPopulationRange] = useState([1000000000, 0]);

  // to display on tooltip
  const getText = (props) => {
    let text = "";
    console.log(props);
    console.log(tooltipData);
    tooltipData.forEach((element) => {
      if (element["FIPS"] == props.GEOID) {
        if (selectedOption === "populationDropdown")
          text =
            element["County"] + " " + " population:" + element["Population"];
        else
          text = element["County"] + " " + " Death Rate:" + element.deathRate;
      }
      return "white";
    });
    return text;
  };

  //  to calculate the state id suing states names
  useEffect(() => {
    const yearData = countyData.filter((d) => {
      return d.Year == selectedYear;
    });

    let stateId = yearData.find((item) => {
      if (item["State"] === selectedState) {
        return item["FIPS State"];
      }
    });
    setSelectedStateId(stateId["FIPS State"]);
  }, [selectedYear, selectedState]);



  //Adding a tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //Creating mouseOver functionality
  let mouseOver = function (d) {
    // d3.selectAll(".State")
    //   .transition()
    //   .duration(300)
    //   .style("opacity", 0.2)
    //   .style("stroke", "#D3D3D3");
    // d3.select(this)
    //   .transition()
    //   .duration(300)
    //   .style("opacity", 1)
    //   .style("stroke", "#D3D3D3");

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
  // let mouseLeave = function (d) {
  //   d3.selectAll("path")
  //     .transition()
  //     .duration(200)
  //     .style("opacity", 1)
  //     .style("stroke", "#D3D3D3");
  //   tooltip.transition().duration(300).style("opacity", 0);
  // };

  // to draw the map
  useEffect(() => {
    const yearStateWiseData = dataPerYear(
      selectedYear,
      countyData,
      selectedStateId
    );
    tooltipData.splice(0, tooltipData.length);
    tooltipData.push(...yearStateWiseData);
    drawMap(yearStateWiseData);
  }, [selectedYear, selectedOption, selectedStateId]);

  // to draw the map, called in useEffect to update the map on change of year or state
  const dataPerYear = (year, data, stateFip) => {
    deathRateRange[0] = 40;
    deathRateRange[1] = 0;
    populationRange[0] = 1000000000;
    populationRange[1] = 0;

    const yearWiseData = data.filter((d) => {
      return d.Year == year && d["FIPS State"] == stateFip;
    });

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

      if (element["FIPS"].toString().length == 4)
        element["FIPS"] = "0" + element["FIPS"].toString();
      else element["FIPS"] = element["FIPS"].toString();

      deathRateRange[0] = Math.min(deathRateRange[0], element.deathRate);
      deathRateRange[1] = Math.max(deathRateRange[1], element.deathRate);
      populationRange[0] = Math.min(populationRange[0], element.Population);
      populationRange[1] = Math.max(populationRange[1], element.Population);
    });
    return yearWiseData;
  };

  // to draw the map, called in useEffect to update the map on change of year or state
  const drawMap = (yearStateWiseData) => {
    const canvas = d3.select("#canvas");
    const countyDataFeatures = countyGeoJson.features;
    const stateWiseFeatures = [];
    countyDataFeatures.forEach((element) => {
      if (element.properties.GEOID.substring(0, 2) == selectedStateId)
        stateWiseFeatures.push(element);
    });

    const colorScalePopulation = d3
    .scaleSequential(d3.schemeGreens[3])
    .domain([populationRange[0], populationRange[1]]);
  const colorScaleDeathrate = d3
    .scaleSequential(d3.schemeOranges[3])
    .domain([deathRateRange[0], deathRateRange[1]]);

    canvas
      .append("g")
      .selectAll("path")
      .data(countyDataFeatures)
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .geoPath()
          .projection(d3.geoAlbersUsa().scale(1300).translate([500, 300]))
      )
      .attr("stroke", (element) => {
        if (stateWiseFeatures.includes(element)) return "black";
        else return "#D3D3D3";
      })
      .attr("fill", function (d) {
        let id = d.properties.GEOID;
        let i;
        for (i = 0; i < yearStateWiseData.length; i++) {
          if (id === yearStateWiseData[i].FIPS) {
            if (selectedOption === "deathRateDropdown") {
              return colorScaleDeathrate(yearStateWiseData[i].deathRate);
            } else {
              return colorScalePopulation(yearStateWiseData[i].Population);
            }
          }
        }
        return "white";
      })
      .on("mouseover", mouseOver)
      // .on("mouseleave", mouseLeave);
  };

  // change the dropdown value
  const changeSelectOptionHandler = (event) => {
    setSelectedYear(event.target.value);
  };

  const selectOptionHandler = (event) => {
    setSelectedOption(event.target.value);
  };

  const selectStateHandler = (event) => {
    setSelectedState(event.target.value);
  };

  return (
    <>
      <div className="heading">
        <h1 id="title">Drug Poisoning Mortality Rate</h1>
        <h2 id="description">USA County Map</h2>
      </div>
      <div className="home-container">
        <div className="svgs">
          <svg id="canvas" style={{ border: "2px solid gold" }} />
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
            <select onChange={selectStateHandler} className="chooseState">
              {stateNames.map((element) => (
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

export default CountyMap;
