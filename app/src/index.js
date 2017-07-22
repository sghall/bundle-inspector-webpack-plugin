import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const fileParam = new URLSearchParams(
  (window.location.search || "").slice(1)
).get("file");

const toLoadPath = fileParam !== null ? `/${fileParam}` : "/demo";

fetch(toLoadPath)
  .then(v => v.json())
  .then(data => {
    const nodes = [];
    const links = [];
    const sizes = [Infinity, -Infinity];
    const names = [];

    function createNodesAndLinks(children, parent, chunkName) {
      for (let i = 0; i < children.length; i++) {
        const target = children[i];

        nodes.push(target);

        links.push({
          source: parent,
          target,
          chunkName
        });

        if (target.groups) {
          createNodesAndLinks(target.groups, target, chunkName);
        } else {
          if (target.statSize < sizes[0]) {
            sizes[0] = target.statSize;
          }

          if (target.statSize > sizes[1]) {
            sizes[1] = target.statSize;
          }
        }
      }
    }

    for (let i = 0; i < data.length; i++) {
      const chunk = data[i];
      nodes.push(chunk);
      names.push({ label: chunk.label, value: true });
      createNodesAndLinks(chunk.groups, chunk, chunk.label);
    }

    ReactDOM.render(
      <App names={names} nodes={nodes} links={links} sizes={sizes} />,
      document.getElementById("root")
    );
  })
  .catch(e => {
    document.body.textContent = `Error fetching data from ${toLoadPath}, ${e}`;
  });
