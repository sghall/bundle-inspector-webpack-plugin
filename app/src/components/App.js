import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createColors } from "./utils";
import TopNav from "./TopNav";
import GraphPage from "./GraphPage";
import TreemapPage from "./TreemapPage";

const App = ({ file, data }) => {
  const colors = createColors(data);

  return (
    <Router>
      <div>
        <TopNav file={file} />
        <Route
          exact
          path="/"
          component={() => <GraphPage data={data} colors={colors} />}
        />
        <Route
          exact
          path="/treemap"
          component={() => <TreemapPage data={data} colors={colors} />}
        />
      </div>
    </Router>
  );
};

export default App;
