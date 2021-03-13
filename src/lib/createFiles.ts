import fs from "fs-extra";

export const createFiles = (scope: string) => {
  createEsLintFile();
  createHuskyFile();
  createLintStageFile();
  createPrettyFile();
  createJestConfig();
  createTsConfig();
  createGitIgnore();
  //src folder
  if (!fs.existsSync("./src")) {
    fs.mkdirSync("./src");
  }
  createIndex();
  createTest();
  //github folder
  if (!fs.existsSync("./.github")) {
    fs.mkdirSync("./.github");
  }
  if (!fs.existsSync("./.github/workflows")) {
    fs.mkdirSync("./.github/workflows");
  }
  createGHPRTest();
  createNPMPublish(scope);
};

const createNPMPublish = (scope: string) => {
  const file = `
  name: Publish NPM Package
  
  on:
      push:
          branches:
              - master
  
  jobs:
      build:
          runs-on: ubuntu-latest
          steps:
              - uses: actions/checkout@v2
              - uses: actions/setup-node@v1
                with:
                    node-version: 12
              - run: npm ci
              - run: npm run lint
              - run: npm test
              - run: npm run build
  
      publish-package:
          needs: build
          runs-on: ubuntu-latest
          steps:
              - uses: actions/checkout@v2
              - uses: actions/setup-node@v1
                with:
                    node-version: 12
                    registry-url: https://npm.pkg.github.com
                    scope: '@${scope}'
              - run: npm ci
              - run: npm publish
                env:
                    NODE_AUTH_TOKEN: \${{secrets.GITHUB_TOKEN}}
  `;
  fs.writeFileSync(".github/workflows/publishPackage.yml", file);
};

const createGHPRTest = () => {
  const file = `name: Tests CI

on:
    pull_request:
        branches:
            - develop
            - master

jobs:
    build:
        runs-on: ubuntu-latest

        strategy:
            matrix:
                node-version: [12.x]
                # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

        steps:
            - uses: actions/checkout@v2
            - name: Use Node.js \${{ matrix.node-version }}
              uses: actions/setup-node@v1
              with:
                  node-version: \${{ matrix.node-version }}
            - run: npm ci
            - run: npm run build --if-present
            - run: npm test
`;
  fs.writeFileSync(".github/workflows/test-pr.yml", file);
};

const createEsLintFile = () => {
  const eslintFile = {
    env: {
      browser: true,
      jest: true,
    },
    extends: [
      "plugin:@typescript-eslint/recommended",
      "prettier",
      "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-use-before-define": 0,
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-empty-function": 0,
    },
    settings: {},
  };
  fs.writeFileSync(".eslintrc", JSON.stringify(eslintFile, null, 2));
};

const createHuskyFile = () => {
  const huskyFile = {
    hooks: {
      "pre-commit": "lint-staged",
    },
  };
  fs.writeFileSync(".huskyrc", JSON.stringify(huskyFile, null, 2));
};

const createLintStageFile = () => {
  const lintStageFile = {
    "*.+(ts|tsx)": ["eslint --fix", "npm run test:staged"],
    "*.+(json|css|yml)": ["prettier --write"],
  };
  fs.writeFileSync(".lintstagedrc", JSON.stringify(lintStageFile, null, 2));
};

const createPrettyFile = () => {
  const prettyFile = {
    semi: true,
    trailingComma: "all",
    singleQuote: true,
    tabWidth: 4,
  };
  fs.writeFileSync(".prettierrc", JSON.stringify(prettyFile, null, 2));
};

const createJestConfig = () => {
  const jestConfig = `export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
};\r\n`;
  fs.writeFileSync("jest.config.ts", jestConfig);
};

const createTsConfig = () => {
  const tsConfig = {
    compilerOptions: {
      target: "es5",
      module: "commonjs",
      lib: ["es2017", "es7", "es6", "dom"],
      declaration: true,
      outDir: "dist",
      strict: true,
      esModuleInterop: true,
    },
    exclude: ["node_modules", "dist"],
  };
  fs.writeFileSync("tsconfig.json", JSON.stringify(tsConfig, null, 2));
};

const createGitIgnore = () => {
  const toIgnore = ["dist/", "node_modules/"];
  let file = "";
  toIgnore.forEach((el) => (file += `${el}\r\n`));
  fs.writeFileSync(".gitignore", file);
};

const createIndex = () => {
  const file = `export const hello: () => string = () => 'hello';\r\n`;
  fs.writeFileSync("src/index.ts", file);
};

const createTest = () => {
  const file = `import {hello} from './index';
  it('should return hello', () => {
    expect(hello()).toEqual('hello');
});\r\n`;
  fs.writeFileSync("src/index.test.ts", file);
};
