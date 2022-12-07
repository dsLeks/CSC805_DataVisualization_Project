import About from "./components/About";
import Dashboard from "./components/Dashboard";
import StateMap from "./components/StateMap";
import CountyMap from "./components/CountyMap";
import Navbar from "./Navbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<About />}></Route>
        <Route exact path="/About" element={<About />}></Route>
        <Route exact path="/Dashboard" element={<Dashboard />}></Route>
        <Route exact path="/StateMap" element={<StateMap />}></Route>
        <Route exact path="/CountyMap" element={<CountyMap />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
