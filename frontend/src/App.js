import "./css/App.css"
import { Outlet, Link } from "react-router-dom";

export default function App() {
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
            </ul>
            <div>
                <Outlet />
            </div>
        </>
    );
}
