import React from "react";
import "./scss/index.scss";
// Routing system
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { routes } from "./router/routes";

const container = document.getElementById("root");

const root = createRoot(container as HTMLElement); // createRoot(container!) if you use TypeScript
const router = createHashRouter(routes);
root.render(
  <main>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </main>,
);
