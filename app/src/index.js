import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "bulma/css/bulma.css";

const file = new URLSearchParams((window.location.search || "").slice(1)).get(
  "file"
);

let ws;
try {
  ws = new WebSocket(`ws://localhost`);
} catch (err) {
  console.warn("Chunky Monkey could not connect :(");
}

window.addEventListener(
  "load",
  () => {
    if (ws) {
      ws.addEventListener("message", event => {
        console.log(JSON.parse(event.data));
      });
    }
  },
  false
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
