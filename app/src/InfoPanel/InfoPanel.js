import React, { Component } from "react";

class InfoPanel extends Component {
  render() {
    const { label, path } = this.props;

    return (
      <div style={{ position: "relative", color: "white" }}>
        <h4 style={{ position: "absolute", top: 10, left: 10 }}>
          {label}
        </h4>
        <h6 style={{ position: "absolute", top: 30, left: 10 }}>
          {path}
        </h6>
      </div>
    );
  }
}

export default InfoPanel;
