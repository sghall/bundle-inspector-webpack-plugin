import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Graph from "./Graph";
import InfoPanel from "./InfoPanel";
import Treemap from "./Treemap";

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
    // this.setState(() => ({
    //   label: node.label || "",
    //   path: node.path || "{bundle root}",
    //   size: node.statSize || ""
    // }));
  }

  render() {
    const { file, data, names, nodes, links, sizes } = this.props;

    return (
      <Router>
        <div>
          <nav className="navbar">
            <div className="navbar-brand">
              <div className="navbar-item">Analyzer 3D Webpack Plugin</div>
              <Link className="navbar-item" to={`/?file=${file}`}>
                <div className="button is-black">3D Graph</div>
              </Link>
              <Link className="navbar-item" to={`/treemap?file=${file}`}>
                <div className="button is-black">Treemap</div>
              </Link>
            </div>
          </nav>
          <Route
            exact
            path="/"
            component={props =>
              <Graph
                names={names}
                nodes={nodes}
                links={links}
                sizes={sizes}
                updateStats={this.updateStats}
              />}
          />
          <Route path="/treemap" component={props => <Treemap data={data} />} />
        </div>
      </Router>
    );
  }
}

export default App;
