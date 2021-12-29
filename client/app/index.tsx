import React from "react";
import { render } from "react-dom";

import { 
  BrowserRouter, 
  // Route
  Routes
  } from "react-router-dom";

import App from "./components/App/App";

import "./styles/styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

render(
  <BrowserRouter>
    <App>
      <Routes>
        {/* <Route exact path="/" component={Home}/> */}
        {/* <Route path="/page1" component={Page1} /> */}
        {/* <Route component={NotFound}/> */}
      </Routes>
    </App>
  </BrowserRouter>,

  document.getElementById("app")
);
