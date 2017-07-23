import React, { Component } from "react";
import Graph from "./Graph";
import InfoPanel from "./InfoPanel";
// import Treemap from "./Treemap";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: "",
      path: "",
      size: ""
    };

    this.updateStats = this.updateStats.bind(this);
  }

  updateStats(e, node) {
    this.setState(() => ({
      label: node.label || "",
      path: node.path || "{bundle root}",
      size: node.statSize || ""
    }));
  }

  render() {
    const { names, nodes, links, sizes } = this.props;

    return (
      <div className="App">
        <nav className="navbar">
          <div className="navbar-brand">
            <div className="navbar-item">Analyzer 3D Webpack Plugin</div>
          </div>
          <div className="navbar-end">
            <a className="navbar-item" href="https://github.com/jgthms/bulma">
              Github
            </a>
            <a className="navbar-item" href="https://twitter.com/jgthms">
              Twitter
            </a>
          </div>
        </nav>
        <InfoPanel {...this.state} />
        <Graph
          names={names}
          nodes={nodes}
          links={links}
          sizes={sizes}
          updateStats={this.updateStats}
        />
      </div>
    );
  }
}

// render() {
//   const { data } = this.props;

//   return (
//     <div className="App">
//       <Treemap data={data} />
//     </div>
//   );
// }

// render() {
//   const { names, nodes, links, sizes } = this.props;

//   return (
//     <div className="App">
//       <InfoPanel {...this.state} />
//       <Graph
//         names={names}
//         nodes={nodes}
//         links={links}
//         sizes={sizes}
//         updateStats={this.updateStats}
//       />
//     </div>
//   );
// }

export default App;
