import fs from "fs";
import path from "path";

export const getCurrentDirectoryBase = () => path.basename(process.cwd());
export const directoryExist = (filePath: fs.PathLike) =>
  fs.existsSync(filePath);
