import React, { Component } from "react";
import Viz from "./Viz";

class App extends Component {
  render() {
    const { data, nodes, links } = this.props;
    console.log(data);

    return (
      <div className="App">
        <Viz nodes={nodes} links={links} />
      </div>
    );
  }
}

export default App;
