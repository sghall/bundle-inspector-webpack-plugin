import React, { Component } from "react";
import Graph from "./Graph";

class App extends Component {
  render() {
    const { data, nodes, links } = this.props;
    console.log(data);

    return (
      <div className="App">
        <Graph nodes={nodes} links={links} />
      </div>
    );
  }
}

export default App;
