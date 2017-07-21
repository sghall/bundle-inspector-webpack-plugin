import React, { Component } from "react";
import Viz from "./Viz";

class App extends Component {
  render() {
    const { data } = this.props;
    console.log(data);

    return (
      <div className="App">
        <Viz />
      </div>
    );
  }
}

export default App;
