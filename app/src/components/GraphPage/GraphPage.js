import React, { Component } from "react";
import Info from "./Info";
import Graph from "./Graph";

class GraphPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      path: "",
      size: ""
    };

    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(d) {
    this.setState(() => ({
      name: d.name || "",
      path: d.path || "",
      size: d.size || ""
    }));
  }

  render() {
    const { data, colors } = this.props;

    return (
      <div>
        <Info {...this.state} />
        <Graph data={data} colors={colors} updateInfo={this.updateInfo} />
      </div>
    );
  }
}

export default GraphPage;
