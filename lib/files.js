const fs = require("fs");
const path = require("path");

module.exports = {
  getCurrentDirectoryBase: () => path.basename(process.cwd()),
  directoryExist: (filePath) => fs.existsSync(filePath),
};
