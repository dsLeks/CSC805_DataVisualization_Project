import "./css/Navbar.css";
import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar() {
  return (
    <>
      <ul className="nav-bar">
        <li className="nav-item">
          <Link to={`HistoricData`}>
            <button className="nav-item-link">Historic Data</button>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={`Dashboard`}>
            <button className="nav-item-link">State Map</button>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={`CountyMap`}>
            <button className="nav-item-link">County Map</button>
          </Link>
        </li>
      </ul>
      <div>
        <Outlet />
      </div>
    </>
  );
}
