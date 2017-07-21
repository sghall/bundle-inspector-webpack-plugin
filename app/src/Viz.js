import React, { Component } from "react";

class Viz extends Component {
  componentDidMount() {
    console.log(this.canvas);
  }

  render() {
    return <canvas ref={d => (this.canvas = d)} />;
  }
}

export default Viz;
