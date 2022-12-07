import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
// import { Col, Row, Container } from "react-bootstrap";
import "../css/StateMap.css";
import stateData from "../data/states_shapefile.json";
import visStateData from "../data/2015_data.json";
const StateMap = () => {
  useEffect(() => {
    drawMap();
  });

  const drawMap = () => {
    const canvas = d3.select("#canvas");
    // const tooltip = d3.select("#tooltip");
    //Adding a tooltip
    const tooltip = d3.select("#tooltip").style("opacity", 0);

    const stateDataFeatures = stateData.features;

    canvas
      .append("g")
      .selectAll("path")
      .data(stateDataFeatures)
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .geoPath()
          .projection(d3.geoAlbersUsa().scale(1200).translate([500, 300]))
      )

      .attr("stroke", "#ffffff")
      .attr("fill", (stateDataFeaturesItem) => {
        let id = stateDataFeaturesItem.properties.FID;
        let state = visStateData.find((item) => {
          return item["FIPS State"] === id;
        });
        let rate = state["Estimated Age"];
        if (rate <= 10) {
          return "limegreen";
        } else if (rate <= 12) {
          return "lightgreen";
        } else if (rate <= 20) {
          return "orange";
        } else {
          return "tomato";
        }
      })
      .attr("data-fips", (stateDataFeaturesItem) => {
        return stateDataFeaturesItem.properties.FID;
      })
      .attr("data-rate", (stateDataFeaturesItem) => {
        let id = stateDataFeaturesItem.properties.FID;
        let state = visStateData.find((item) => {
          return item["FIPS State"] === id;
        });
        let rate = state["Estimated Age"];

        return rate;
      })
      .attr("class", "State")
      .on("mousemove", mouseOver)
      .on("mouseleave", mouseLeave);
    // .on("mouseover", (stateDataFeaturesItem) => {
    //   tooltip.transition().style("visibility", "visible");
    //   let id = stateDataFeaturesItem["properties.FID"];

    //   let state = visStateData.find((item) => {
    //     return item["FIPS State"] === id;
    //   });
    //   // let state = visStateData.find((item) => {
    //   //   return item["FIPS State"] === id;
    //   // });

    //   tooltip.text(
    //     state["FIPS State"] +
    //       "-" +
    //       state["Population"] +
    //       "," +
    //       state["State"] +
    //       ":" +
    //       state["Estimated Age"] +
    //       "%"
    //   );

    //   tooltip.attr("data-rate", state["Estimated Age"]);
    // })
    // .on("mouseout", (stateDataFeaturesItem) => {
    //   tooltip.transition().style("visibility", "hidden");
    // });

    // canvas
    //   .selectAll(".State")
    //   .data(stateDataFeatures)
    //   .enter()
    //   .append("text")
    //   .attr("fill", "black")
    //   .attr("transform", function (d) {
    //     var centroid = path.centroid(d);
    //     return "translate(" + centroid[0] + "," + centroid[1] + ")";
    //   })
    //   .attr("text-anchor", "middle")
    //   .attr("dy", ".35em")
    //   .text(function (d) {
    //     return d.properties.State_Name;
    //   });

    function mouseOver(d) {
      d3.selectAll(".State")
        .transition()
        .duration(300)
        .style("opacity", 0.5)
        .style("stroke", "white");
      d3.select(this)
        .transition()
        .duration(300)
        .style("opacity", 1)
        .style("stroke", "black");

      console.log(d);
      tooltip
        .style("left", d.x + "px")
        .style("top", d.y + "px")
        .style("opacity", 1)
        .style("position", "absolute")
        .style("border", "solid")
        .style("border-radius", "5px")
        .style("background-color", "black")
        .style("padding", "5px")
        .text(d.target.__data__.properties.State_Name)
        .transition()
        .duration(300);
    }

    //Creating mouseLeave functionality
    function mouseLeave(d) {
      d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "#ffffff");
      tooltip.transition().duration(300).style("opacity", 0);
    }
  };

  return (
    <>
      <br />
      <h2 id="title">Drug Poisoning Mortality Rate</h2>
      <div id="description">USA Heat Map</div>
      <div id="tooltip"></div>
      <div id="svgTag">
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
      </div>

      <br />
    </>
  );
};

export default StateMap;
