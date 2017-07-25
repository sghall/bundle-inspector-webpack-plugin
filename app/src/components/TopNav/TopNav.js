import React from "react";
import { Link } from "react-router-dom";
import { formatBytes } from "../utils";
import monkey from "./chunky-monkey.svg";

const TopNav = ({ file, total }) =>
  <nav className="navbar">
    <div className="navbar-brand">
      <div className="navbar-item">
        <img src={monkey} alt="chunky-monkey" height="32" />
      </div>
      <div className="navbar-item">
        <a
          href="https://github.com/sghall/chunky-monkey"
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
      <div className="navbar-item">
        <h3 className="title is-3">{`Total: ${formatBytes(total)}`}</h3>
      </div>
    </div>
  </nav>;

export default TopNav;
