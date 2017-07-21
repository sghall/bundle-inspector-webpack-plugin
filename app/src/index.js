import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const fileParam = new URLSearchParams(
  (window.location.search || "").slice(1)
).get("file");

const toLoadPath = fileParam !== null ? `/${fileParam}` : "/demo.json";
console.log(toLoadPath);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
