#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import * as files from "./lib/files";
import { askProjectConfig, InquirerValues } from "./lib/inquirer";
import fs from "fs-extra";
import spawn from "cross-spawn";
import { createFiles } from "./lib/createFiles";
const allDevDependencies: string[] = [
  "@types/jest",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "eslint",
  "eslint-config-prettier",
  "eslint-plugin-prettier",
  "husky",
  "jest",
  "lint-staged",
  "prettier",
  "standard-version",
  "ts-node",
  "ts-jest",
  "typescript",
];

clear();

console.log(
  chalk.yellow(figlet.textSync("CGHP", { horizontalLayout: "full" }))
);

if (!files.directoryExist(".git")) {
  console.log(chalk.red("not a git repository!"));
  process.exit();
}
if (files.directoryExist("package.json")) {
  console.log(chalk.red("package.json already exist"));
  process.exit();
}

const installDependencies: () => Promise<void> = () => {
  return new Promise((resolve, reject) => {
    const args = [
      "install",
      "--save-dev",
      "--save-exact",
      "--loglevel",
      "--verbose",
      "error",
    ].concat(allDevDependencies);
    const child = spawn("npm", args);
    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `npm ${args.join(" ")}`,
        });
        return;
      }
      resolve();
    });
  });
};

const createPackageJson = (packageInfo: InquirerValues) => {
  const packageJson = {
    name: `@${packageInfo.userName}/${packageInfo.packageName}`,
    version: "1.0.0",
    types: "dist/src/index.d.ts",
    main: "dist/src/index.js",
    files: ["dist"],
    scripts: {
      build: "tsc",
      test: "jest",
      lint: "eslint --fix",
      release: "standard-version",
      prepublish: "npm run lint && npm run test && npm run build",
    },
    repository: {
      type: "git",
      url: `git+https://github.com/${packageInfo.userName}/${packageInfo.packageName}`,
    },
    keywords: [],
    author: `${packageInfo.userName}`,
    license: "ISC",
    bugs: {
      url: `https://github.com/${packageInfo.userName}/${packageInfo.packageName}/issues`,
    },
    homepage: `https://github.com/${packageInfo.userName}/${packageInfo.packageName}`,
    publishConfig: {
      registry: `https://npm.pck.github.com/${packageInfo.userName}`,
    },
  };
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
};

const run = async () => {
  const packageInfo = await askProjectConfig();
  createPackageJson(packageInfo);
  createFiles(packageInfo.userName);
  console.log("Installing Packages. this might take a couple of minutes.");
  installDependencies().then(() => {
    try {
      spawn("npm", ["run", "lint"]);
    } catch (e) {
      console.log("please run npm run lint");
    }

    console.log(chalk.green("Success"));
    console.log(
      "please make sure you have a secret called GITHUB_TOKEN in your repo"
    );
    console.log(
      "for more information on how this package work and how to setup your repo visit: https://github.com/antoniopacheco/private-github-package"
    );
    console.log("you have the following available commands:" + "\n");
    console.log(chalk.blueBright("build"));
    console.log(
      "compile your typescript and place it under build folder:" + "\n"
    );
    console.log(chalk.blueBright("test"));
    console.log("run unit testing using jest" + "\n");
    console.log(chalk.blueBright("lint"));
    console.log("run eslint and prettier and fix issues" + "\n");
    console.log(chalk.blueBright("release"));
    console.log("bumps version number and update changelog.md" + "\n");
  });
};

run();
