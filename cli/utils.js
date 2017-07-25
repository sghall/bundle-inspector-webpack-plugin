const path = require("path");

const APP_PUBLIC = "/../app/build";

module.exports = {
  getWritePathForSerializedData: (dataPath, contextPath = __dirname) => {
    return path.join(contextPath, APP_PUBLIC, dataPath || `data_${Date.now()}`);
  }
};
