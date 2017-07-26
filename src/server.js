const openPort = require("openport");
const express = require("express");
const http = require("http");
const path = require("path");
const opn = require("opn");
const ws = require("ws");

const APP_BUILD = "/../app/build";

module.exports = function launchServer(dataPath, contextPath = __dirname) {
  openPort.find((err, port) => {
    if (err != null) {
      console.log(err);
      process.exit(1);
    }

    const app = express();

    app.use(express.static(path.resolve(contextPath, "..", "build")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(contextPath, "..", "build", "index.html"));
    });

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });

    const server = http.createServer(app);
    const wss = new ws.Server({ server });

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
