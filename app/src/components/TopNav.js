import React from "react";
import { Link } from "react-router-dom";
import { formatBytes } from "./utils";

const TopNav = ({ file, total }) =>
  <nav className="navbar">
    <div className="navbar-brand">
      <div className="navbar-item">Analyzer 3D Webpack Plugin</div>
      <div className="navbar-item">
        <a
          href="https://github.com/sghall/analyzer-3d-webpack-plugin"
          className="button is-outlined"
        >
          Github
        </a>
      </div>
      <Link className="navbar-item" to={`/?file=${file}`}>
        <div className="button is-black">3D Graph</div>
      </Link>
      <Link className="navbar-item" to={`/treemap?file=${file}`}>
        <div className="button is-black">Treemap</div>
      </Link>
      <div className="navbar-item" to={`/?file=${file}`}>
        <div className="button is-black">
          {formatBytes(total)}
        </div>
      </div>
    </div>
  </nav>;

export default TopNav;
