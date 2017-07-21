import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const fileParam = new URLSearchParams(
  (window.location.search || "").slice(1)
).get("file");

const toLoadPath = fileParam !== null ? `/${fileParam}` : "/demo.json";
console.log(toLoadPath);

fetch(toLoadPath, { credentials: "include" })
  .then(v => v.json())
  .then(data => {
    ReactDOM.render(<App data={data} />, document.getElementById("root"));
  })
  .catch(e => {
    document.body.textContent = `Error fetching data from ${toLoadPath}, ${e}`;
  });
