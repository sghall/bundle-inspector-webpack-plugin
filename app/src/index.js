import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.css";
import "./index.css";
import App from "./App";
import { createNodesAndLinks, createTree } from "./utils";

const file = new URLSearchParams((window.location.search || "").slice(1)).get(
  "file"
);

const toLoadPath = file !== null ? `/${file}` : "/demo";

fetch(toLoadPath)
  .then(v => v.json())
  .then(data => {
    ReactDOM.render(
      <App
        file={file}
        data={createTree(data)}
        {...createNodesAndLinks(data)}
      />,
      document.getElementById("root")
    );
  })
  .catch(e => {
    document.body.textContent = `Error fetching data from ${toLoadPath}, ${e}`;
  });
