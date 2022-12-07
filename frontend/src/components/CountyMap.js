import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
// import { Col, Row, Container } from "react-bootstrap";
import "../css/StateMap.css";
import countyGeoJson from "../data/countiesGeoJson.json";
import countyData from './countyData.json';


const CountyMap = () => {
    const STATE = "06";
    const YEAR = "2015";
    useEffect(() => {
        const yearStateWiseData = dataPerYear(YEAR, countyData, STATE);
        console.log(yearStateWiseData);
        drawMap(yearStateWiseData);
    });
   
    const dataPerYear = (year, data, stateFip) => {
        const yearWiseData = data.filter((d) => {
          return (d.Year == year && d["FIPS State"] == stateFip);
        })
        
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
          
          if(element["FIPS"].toString().length == 4)
            element["FIPS"] = "0" + element["FIPS"].toString();
          else
            element["FIPS"] = element["FIPS"].toString();
        });
        return yearWiseData;
      }
    const drawMap = (yearStateWiseData) => {
        const canvas = d3.select("#canvas");
        const tooltip = d3.select("#tooltip");
        const countyDataFeatures = countyGeoJson.features;

        const stateWiseFeatures = [];
        countyDataFeatures.forEach(element => {
            if(element.properties.GEOID.substring(0,2) == STATE)
                stateWiseFeatures.push(element)
        });

        console.log(stateWiseFeatures);

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
            .projection(d3.geoAlbers().scale(1000).translate([400, 300]))
        )
        .attr("stroke", (element) =>{
            if(stateWiseFeatures.includes(element))
                return "black"
            else
                return "#D3D3D3"
        })
          .attr("fill", (stateDataFeaturesItem) => {
            let id = stateDataFeaturesItem.properties.GEOID;
            let county = yearStateWiseData.find((item) => {
              return item["FIPS"] === id;
            });
            if(county != undefined){
                let rate = county.deathRate;
                if (rate <= 10) {
                    return "limegreen";
                } else if (rate <= 12) {
                    return "lightgreen";
                } else if (rate <= 20) {
                    return "orange";
                } else {
                    return "red";
                }
            }else{
                return "white";
            }
          })
        //   .attr("data-fips", (stateDataFeaturesItem) => {
        //     return stateDataFeaturesItem.properties.FID;
        //   })
        //   .attr("data-rate", (stateDataFeaturesItem) => {
        //     let id = stateDataFeaturesItem.properties.FID;
        //     let state = visStateData.find((item) => {
        //       return item["FIPS State"] === id;
        //     });
        //     let rate = state["Estimated Age"];

        //     return rate;
        //   })
        //   .on("mouseover", (stateDataFeaturesItem) => {
        //     tooltip.transition().style("visibility", "visible");
        //     let id = stateDataFeaturesItem["properties.FID"];

        //     let state = visStateData.find((item) => {
        //       return item["FIPS State"] === id;
        //     });
        //     // let state = visStateData.find((item) => {
        //     //   return item["FIPS State"] === id;
        //     // });

        //     tooltip.text(
        //       state["FIPS State"] +
        //         "-" +
        //         state["Population"] +
        //         "," +
        //         state["State"] +
        //         ":" +
        //         state["Estimated Age"] +
        //         "%"
        //     );

        //     tooltip.attr("data-rate", state["Estimated Age"]);
        //   })
        //   .on("mouseout", (stateDataFeaturesItem) => {
        //     tooltip.transition().style("visibility", "hidden");
        //   });
    };

    return (
        <>
        <br />
        <h2 id="title">Drug Poisoning Mortality Rate</h2>
        <div id="description">USA County Map</div>
        <div id="tooltip"></div>
        <svg id="canvas" style={{ border: "2px solid gold" }} />
        <svg id="legend">
            <g>
            <rect x="10" y="0" width="40" height="40" fill="limegreen"></rect>
            <text x="60" y="20" fill="black">
                less than 10%
            </text>
            </g>
            <g>
            <rect x="10" y="40" width="40" height="40" fill="lightgreen"></rect>
            <text x="60" y="60" fill="black">
                10% than 12%
            </text>
            </g>
            <g>
            <rect x="10" y="80" width="40" height="40" fill="orange"></rect>
            <text x="60" y="100" fill="black">
                12% than 20%
            </text>
            </g>
            <g>
            <rect x="10" y="120" width="40" height="40" fill="tomato"></rect>
            <text x="60" y="140" fill="black">
                more than 20%
            </text>
            </g>
        </svg>

        <br />
        </>
    );
};

export default CountyMap;
