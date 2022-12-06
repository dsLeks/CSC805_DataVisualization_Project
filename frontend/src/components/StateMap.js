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
    const tooltip = d3.select("#tooltip");
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
          .projection(d3.geoAlbersUsa().scale(1000).translate([400, 300]))
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
      .on("mouseover", (stateDataFeaturesItem) => {
        tooltip.transition().style("visibility", "visible");
        let id = stateDataFeaturesItem["properties.FID"];

        let state = visStateData.find((item) => {
          return item["FIPS State"] === id;
        });
        // let state = visStateData.find((item) => {
        //   return item["FIPS State"] === id;
        // });

        tooltip.text(
          state["FIPS State"] +
            "-" +
            state["Population"] +
            "," +
            state["State"] +
            ":" +
            state["Estimated Age"] +
            "%"
        );

        tooltip.attr("data-rate", state["Estimated Age"]);
      })
      .on("mouseout", (stateDataFeaturesItem) => {
        tooltip.transition().style("visibility", "hidden");
      });
  };

  return (
    <>
      <br />
      <h2 id="title">Drug Poisoning Mortality Rate</h2>
      <div id="description">USA Heat Map</div>
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

export default StateMap;
