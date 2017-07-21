import React, { Component } from "react";

class Viz extends Component {
  componentDidMount() {
    console.log(this.canvas);
  }

  render() {
    const { data } = this.props;
    console.log(data);

    return <canvas ref={d => (this.canvas = d)} />;
  }
}

export default Viz;
