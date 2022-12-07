import React, { useRef, useEffect, useState } from "react";
var d3 = require("d3");
import geojsonData from './geojsonData.json';
import countyData from './countyData.json';
import { useData } from './useData';
import { legendColor } from 'd3-svg-legend';
  
const PopulationMap = () => {
  const geoData = geojsonData;
  const height = 800;
  const width = 1000;
  const data = useData(); 
  const svgRef = useRef();
  const lsvgRef = useRef(); 
  const projRef = useRef(d3.geoAlbersUsa().scale(1200).translate([width/2, height/2.5]));
  const selectedYear = 2015;
  const [ population_data, setPopulation ] = useState([]);

    
  //Setting up the Choropleth map data to input
  const max_population = 40000000;
  const min_population = 500000;
  const colorScale = d3.scaleSequential(d3.schemeGreens[3])
                       .domain([0, 10000000]);


  //Adding a tooltip
  const tooltip = d3.select('body').append('div')
	.attr("class", "tooltip")
	.style("opacity", 0);

  //Creating mouseOver functionality
  let mouseOver = function(d) {
    d3.selectAll(".State")
        .transition()
        .duration(300)
        .style("opacity", .2)
        .style("stroke", "transparent")
    d3.select(this)
        .transition()
        .duration(300)
        .style("opacity", 1)
        .style("stroke", "black");

    tooltip.style("left", (d.x) + "px")
           .style("top", (d.y) + "px")
            .style("opacity", 1)
            .style("position", "absolute")
            .style("border", "solid")
            .style("border-radius", "5px")
            .style("background-color", "#ebf8e7")
            .style("padding", "5px")
            .text(d.target.__data__.properties.NAME)
            .transition().duration(300) 

  }

  //Creating mouseLeave functionality
  let mouseLeave = function(d) {
    d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "none");
    tooltip.transition().duration(300)
            .style("opacity", 0);
  }

  const dataPerYear = (year, data) => {
    const yearWiseData = data.filter((d) => {
      return d.Year == year;
    })
    const stateFips = [];
    const statewiseData = [];
    yearWiseData.forEach(element => {
      const deathRate = element["Estimated Age-adjusted Death Rate, 16 Categories (in ranges)"];
      if(deathRate.includes("-")){
        const split = deathRate.split("-");
        const start = parseInt(split[0]);
        const end = parseInt(split[1]);
        element.deathRate = (start + end) / 2;
      }else{
        element.deathRate = parseInt(deathRate.substring(1, deathRate.length));
      }
      if(!stateFips.includes(element["FIPS State"])){
        stateFips.push(element["FIPS State"]);
      }
      // int start = element
      // element.deathRate = 
    });
  
    stateFips.forEach(element => {
      const stateData = yearWiseData.filter((d) => {
        return d["FIPS State"] == element;
      })
      let sum = 0;
      stateData.forEach(element => {
        sum += element.deathRate;
      });
      let totalpopulation = 0;
      stateData.forEach(element => {
        totalpopulation += parseInt(element.Population);
      });
      const state = {
        "StateFIPS": element,
        "deathRate": sum / stateData.length,
        "population": totalpopulation
      }
      statewiseData.push(state);
    });
    return statewiseData;
  }


  const yearWiseData = dataPerYear("2011", countyData);
  //console.log(yearWiseData);
  
  useEffect(() => {  

    var index;         
    //Drawing the Choropleth Map - for population 
    if((yearWiseData.length > 1) && (typeof yearWiseData !== 'undefined')) {
      const svg = d3.select(svgRef.current)
                    .attr("width", width)
                    .attr("height", height);
      const path = d3.geoPath(projRef.current);
      svg.append("g")
          .attr("width", 500)
        .attr("height", 500)
        .selectAll("path")
        .data(geoData.features)
        .join(
          enter => enter 
                    .append("path")
                    .attr("d", function(d) {
                      return path(d);
                    })
                     .attr("fill",
                     function(d) {
                      //console.log(d);
                      var i;
                      var d_state_fips = d.properties.STATEFP;
                      for(i = 0; i < yearWiseData.length; i++) {
                        if(d_state_fips == yearWiseData[i].StateFIPS) {
                          return colorScale(yearWiseData[i].population);
                        }
                      }
                    })
                    .attr("opacity", "1")
                    .attr("data-stateName", function(d) {
                      return d.properties.NAME;
                    })
                    .attr("class" , "State")
                    .attr("stroke", "none")
                    .on("mouseover", mouseOver)
                    .on("mouseleave", mouseLeave),
          update => update,
          exit => exit.remove()
          
        )
      
    } else {
          console.log("yearWiseData is empty");
        } 

  }, [yearWiseData]);




  return (
    <>
    <svg ref={ svgRef }></svg>

    <div>
      <svg>
        <defs>
        <linearGradient id="linear-gradient" x1="0%" y1= "0%" x2="100%" y2= "0%">
          <stop offset="0%" stop-color="#eaf9e5"></stop>
          <stop offset="80%" stop-color="#6ac263"></stop>
          <stop offset="100%" stop-color="#001f00"></stop>
        </linearGradient>
      </defs>
      <rect width="300" height="20" fill="url(#linear-gradient)"></rect>
      </svg>
    </div>

    </>
  );
};
  
export default PopulationMap;