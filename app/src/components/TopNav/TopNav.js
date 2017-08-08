import React from "react";
import { Link } from "react-router-dom";
import { formatBytes } from "../utils";
import logo from "./logo.svg";

const TopNav = ({ file, total }) =>
  <nav className="navbar">
    <div className="navbar-brand">
      <div className="navbar-item">
        <img
          src={logo}
          alt="bundle-inspector-webpack-plugin"
          style={{ height: 32 }}
        />
      </div>
      <div className="navbar-item">
        <a
          href="https://github.com/sghall/bundle-inspector-webpack-plugin"
          className="button is-outlined"
        >
          Github
        </a>
      </div>
      <Link className="navbar-item" to={`/?file=${file}`}>
        <div className="button is-black">3D Graph</div>
      </Link>
      <Link className="navbar-item" to={`/circle?file=${file}`}>
        <div className="button is-black">Circle Pack</div>
      </Link>
      <Link className="navbar-item" to={`/treemap?file=${file}`}>
        <div className="button is-black">Treemap</div>
      </Link>
      <div className="navbar-item">
        <h3 className="title is-3">{`Total: ${formatBytes(total)}`}</h3>
      </div>
    </div>
  </nav>;

export default TopNav;
