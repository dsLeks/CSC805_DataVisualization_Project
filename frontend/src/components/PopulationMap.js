import React, { useRef, useEffect, useState } from "react";
var d3 = require("d3");
import geojsonData from './geojsonData.json';
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
                       .domain([600000, 5800000]);

  const filter_for_population = (async (jsondata, myCallback) => {
    const jsonFilteredData = jsondata.map((d) => {
      return {
          'fips_state': parseInt(d.fips_state),
          'population': parseInt(d.population),
          'state' : d.state,
          'year' : parseInt(d.year),
      }     
    })
     return myCallback(jsonFilteredData);
  }) 
  

  const combine_years_for_population = (async (filteredData) => {
    
    const containsObject = (obj, list) => {
    var i; 
    for(i = 0; i < list.length; i++) {
        if(list[i].state == obj.state) {
            return i;
        }
    }

    return i; 
    }


    var i; 
    let newFilteredData = [];
    newFilteredData.push(filteredData[0]);

    for(i = 1; i < filteredData.length; i++) {
        const index = containsObject(filteredData[i], newFilteredData);
        if(index < newFilteredData.length && newFilteredData.length > 0) {
            newFilteredData[index].population += filteredData[i].population;   
        } else {
            newFilteredData.push(filteredData[i]);
        }
    }
    return newFilteredData; 
  })

  //Adding a tooltip
  const tooltip = d3.select('body').append('div')
	.attr("class", "tooltip")
	.style("opacity", 0);

  //Creating mouseOver functionality
  let mouseOver = function(d) {
    d3.selectAll(".State")
        .transition()
        .duration(300)
        .style("opacity", .5)
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

  useEffect(() => {
    if(typeof data !== 'undefined')
    {  
      filter_for_population(data, combine_years_for_population)
        .then((pop_data) => {
            setPopulation(pop_data);
        });
    }
  }, [data]);
  
  
  useEffect(() => {  
    var index;         
    //Drawing the Choropleth Map - for population 
    if((population_data.length > 1) && (typeof population_data !== 'undefined')) {
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
                      for(i = 0; i < population_data.length; i++) {
                        if(d_state_fips == population_data[i].fips_state) {
                          return colorScale(population_data[i].population);
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
      

        // //appending the Legend
        // const lsvg = d3.select(lsvgRef.current)
        //                .attr("position", "absolute")
        //                .attr("left", "100px")
        //                .attr("top", "800px");
        // var defs = lsvg.append("defs");

        // var linearGradient = defs.append("linearGradient").attr("id", 'linear-gradient');
        // linearGradient.attr("x1", "0%")
        //               .attr("y1", "0%")
        //               .attr("x2", "100%")
        //               .attr("y2", "0%");
        // linearGradient.append("stop")
        //               .attr("offset", "0%")
        //               .attr("stop-color", "#eaf9e5");
        // linearGradient.append("stop")
        //               .attr("offset", "50%")
        //               .attr("stop-color", "#6ac263");
        // linearGradient.append("stop")
        //               .append("offset", "100%")
        //               .attr("stop-color", "#001f00");
        // lsvg.append("rect")
        //    .attr("width", 550)
        //    .attr("height", 20)
        //    .style("fill", "url(#linear-gradient)");
    // const legend = svg.selectAll("g.legendEntry")
    //                 .data(colorScale.range())
    //                 .enter()
    //                 .append("g").attr("class", "legendEntry")
    
    // legend.append('rect')
    //       .attr("x", width - 600)
    //       .attr("y", function(d, i) {
    //         return i * 10;
    //       })
    //       .attr("width", 10)
    //       .attr("height", 10)
    //       .style("stroke", "black")
    //       .style("stroke-width", 1)
    //       .style("fill", function(d) {
    //         return d; 
    //       })

    // legend.append('text')
    //       .attr("x" , width - 580)
    //       .attr("y", function(d,i) {
    //         return i * 10;
    //       })
    //       .attr("dy", "0.8em")
    //       .text(function(d,i) {
    //         var extent = d3.extent(colorScale(d));
    //         console.log(extent);
    //       })

} else {
      console.log("population_data is empty");
    } 

  }, [population_data]);




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