import { prompt, QuestionCollection } from "inquirer";
import { getCurrentDirectoryBase } from "./files";

export interface InquirerValues {
  userName: string;
  packageName: string;
}

export const askProjectConfig = () => {
  const argv = require("minimist")(process.argv.slice(2));
  const questions: QuestionCollection<any> = [
    {
      name: "userName",
      type: "input",
      message: "Enter your github username or organization",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter  your username or organization";
        }
      },
    },
    {
      name: "packageName",
      type: "input",
      message: "Enter a name for your package (no camel case)",
      default: argv._[0] || getCurrentDirectoryBase(),
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter a name for your package";
        }
      },
    },
  ];
  return prompt<InquirerValues>(questions);
};
