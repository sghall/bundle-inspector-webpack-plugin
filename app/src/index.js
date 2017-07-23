import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createNodesAndLinks, createTree } from "./utils";

const fileParam = new URLSearchParams(
  (window.location.search || "").slice(1)
).get("file");

const toLoadPath = fileParam !== null ? `/${fileParam}` : "/demo";

fetch(toLoadPath)
  .then(v => v.json())
  .then(data => {
    ReactDOM.render(
      <App data={createTree(data)} {...createNodesAndLinks(data)} />,
      document.getElementById("root")
    );
  })
  .catch(e => {
    document.body.textContent = `Error fetching data from ${toLoadPath}, ${e}`;
  });
