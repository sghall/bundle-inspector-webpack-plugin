import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Viz from "./Viz";

class App extends Component {
  render() {
    const { data } = this.props;
    console.log(data);

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Viz />
      </div>
    );
  }
}

export default App;
