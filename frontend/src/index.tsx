import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss";
import reportWebVitals from "./reportWebVitals";
// Routing system
import { HashRouter } from "react-router-dom";
import { Layout } from "./components/layout";
import { RouterWrapper } from "./router/router";
import { routes } from "./router/routes";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <RouterWrapper routes={routes} wrapper={Layout} />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
