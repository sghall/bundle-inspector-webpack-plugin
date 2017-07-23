import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "bulma/css/bulma.css";

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
