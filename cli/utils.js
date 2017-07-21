const path = require("path");

const VIZ_PATH = "/../app/public";

module.exports = {
  getWritePathForSerializedData: (dataPath, contextPath = __dirname) => {
    return path.join(contextPath, VIZ_PATH, dataPath || `data_${Date.now()}`);
  }
};
