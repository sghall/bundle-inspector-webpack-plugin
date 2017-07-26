const httpServer = require("http-server");
const openPort = require("openport");
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

    const server = httpServer
      .createServer({
        root: path.join(contextPath, APP_BUILD)
      })
      .listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
        console.log(`Press Control+C to Quit`);
        opn(`http://localhost:${port}?file=${dataPath}`);
      });

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
