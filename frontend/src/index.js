import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import HistoricData from "./components/HistoricData";
import Dashboard from "./components/Dashboard";
import Navbar from "./Navbar";
import CountyMap from "./components/CountyMap";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/HistoricData",
        element: <HistoricData />,
      },
      {
        path: "Dashboard",
        element: <Dashboard />,
      },
      {
        path: "CountyMap",
        element: <CountyMap />,
      },
    ],
  },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <div style={{background: 'white'}}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </div>
);
