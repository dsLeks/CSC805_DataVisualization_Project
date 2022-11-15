import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
  } from "react-router-dom";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import App from "./App"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "About",
                element: <About />
            },
            {
                path: "Dashboard",
                element: <Dashboard />
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