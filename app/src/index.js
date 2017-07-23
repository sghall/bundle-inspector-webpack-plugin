import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.css";
import "./index.css";
import App from "./components/App";

const file = new URLSearchParams((window.location.search || "").slice(1)).get(
  "file"
);

const path = file !== null ? `/${file}` : "/demo";

fetch(path)
  .then(d => d.json())
  .then(data => {
    ReactDOM.render(
      <App file={file} data={data} />,
      document.getElementById("root")
    );
  })
  .catch(e => {
    document.body.textContent = `Error fetching data from ${path}, ${e}`;
  });
