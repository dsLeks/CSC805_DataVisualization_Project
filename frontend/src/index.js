import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
  } from "react-router-dom";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Navbar from "./Navbar"
import CountyMap from "./components/CountyMap"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />,
        children: [
            {
                path: "/",
                element: <About />
            },
            {
                path: "/About",
                element: <About />
            },
            {
                path: "Dashboard",
                element: <Dashboard />
            },
            {
                path: "CountyMap",
                element: <CountyMap />
            }
        ]
    },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);