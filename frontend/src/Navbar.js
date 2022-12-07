import "./css/Navbar.css"
import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar() {
    return (
        <>
            <ul className="nav-bar">
                <li className="nav-item">
                    <Link to={`About`}>
                        <button className="nav-item-link">About Us</button>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={`Dashboard`}>
                        <button className="nav-item-link">Dashboard</button>
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
