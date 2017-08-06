import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createColors } from "./utils";
import TopNav from "./TopNav";
import GraphPage from "./GraphPage";
import SpherePage from "./SpherePage";
import TreemapPage from "./TreemapPage";

const App = ({ file, data }) => {
  const colors = createColors(data);

  return (
    <Router>
      <div>
        <TopNav file={file} total={data.reduce((m, n) => m + n.statSize, 0)} />
        <Route
          exact
          path="/"
          component={() => <GraphPage data={data} colors={colors} />}
        />
        <Route
          exact
          path="/sphere"
          component={() => <SpherePage data={data} colors={colors} />}
        />
        <Route
          exact
          path="/treemap"
          component={() => <TreemapPage data={data} colors={colors} />}
        />
        <footer className="footer">
          <div className="container">
            <div className="content has-text-centered">
              Bundle Inspector on
              <a href="https://github.com/sghall/bundle-inspector-webpack-plugin">
                {" "}Github
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
