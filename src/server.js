const openPort = require("openport");
const express = require("express");
const http = require("http");
const path = require("path");
const opn = require("opn");
const ws = require("ws");
const { yellow } = require("chalk");

const APP_BUILD = "/../app/build";

module.exports = function launchServer(dataPath, contextPath = __dirname) {
  openPort.find((err, port) => {
    if (err != null) {
      console.log(err);
      process.exit(1);
    }

    const app = express();

    app.use(express.static(path.join(contextPath, APP_BUILD)));
    app.get("*", (req, res) => {
      res.sendFile(path.join(contextPath, APP_BUILD, "index.html"));
    });

    app.listen(port, () => {
      console.log(yellow(`Chunky Monkey listening on port ${port}`));
      console.log(yellow(`Press Control+C to Quit`));
      opn(`http://localhost:${port}?file=${dataPath}`);
    });

    const server = http.createServer(app);
    const wss = new ws.Server({ server });

    wss.on("connection", function connection(ws, req) {
      ws.send("something");
    });

    return function(dataPath) {
      wss.clients.forEach(c => {
        if (c.readyState === ws.OPEN) {
          c.send({
            next: `http://localhost:${port}?file=${dataPath}`
          });
        }
      });
    };
  });
};
