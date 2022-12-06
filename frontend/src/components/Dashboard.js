import React, { useRef, useEffect, useState } from "react";
import { select } from "d3";

const Dashboard = () => {
  const [data, setData] = useState([25, 30, 45, 60, 55]);
  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);
    svg
      .selectAll("circle")
      .data(data)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "new")
            .attr("cx", (value) => value * 5)
            .attr("cy", (value) => value * 5)
            .attr("r", (value) => value)
            .attr("stroke", "red")
            .attr("padding", "50px"),
        (update) => update.attr("class", "updated"),
        (exit) => exit.remove()
      );
  }, [data]);

  return (
    <>
      <svg ref={svgRef} style={{ border: "10px solid green" }}></svg>
      <button onClick={() => setData(data.map((value) => value + 5))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter((value) => value < 35))}>
        Filter data
      </button>
    </>
  );
};

export default Dashboard;
