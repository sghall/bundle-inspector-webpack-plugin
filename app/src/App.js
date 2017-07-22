import React, { Component } from "react";
import Graph from "./Graph";

class App extends Component {
  render() {
    const { data, nodes, links, sizes } = this.props;

    return (
      <div className="App">
        <Graph nodes={nodes} links={links} sizes={sizes} />
      </div>
    );
  }
}

export default App;
