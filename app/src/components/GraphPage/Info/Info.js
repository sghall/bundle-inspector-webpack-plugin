import React from "react";
import { formatBytes } from "../../utils";

const Info = ({ name, path, size }) =>
  <div style={{ position: "relative", color: "white" }}>
    <h4 style={{ position: "absolute", top: 10, left: 10 }}>
      {name ? `Name: ${name} (${formatBytes(size)})` : null}
    </h4>
    <h6 style={{ position: "absolute", top: 30, left: 10 }}>
      {path ? `Path: ${path}` : null}
    </h6>
  </div>;

export default Info;
