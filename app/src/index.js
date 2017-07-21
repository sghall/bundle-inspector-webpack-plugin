import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const fileParam = new URLSearchParams(
  (window.location.search || "").slice(1)
).get("file");

const toLoadPath = fileParam !== null ? `/${fileParam}` : "/demo";
console.log(toLoadPath);

fetch(toLoadPath, { credentials: "include" })
  .then(v => v.json())
  .then(data => {
    const nodes = [];
    const links = [];

    function createNodesAndLinks(children, parent) {
      for (let i = 0; i < children.length; i++) {
        const target = children[i];

        nodes.push(target);

        links.push({
          source: parent,
          target
        });

        if (target.groups) {
          createNodesAndLinks(target.groups, target);
        }
      }
    }

    nodes.push(data[0]);
    createNodesAndLinks(data[0].groups, data[0]);

    console.log(nodes, links);

    ReactDOM.render(
      <App data={data} nodes={nodes} links={links} />,
      document.getElementById("root")
    );
  })
  .catch(e => {
    document.body.textContent = `Error fetching data from ${toLoadPath}, ${e}`;
  });
