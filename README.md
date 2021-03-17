# CREATE GITHUB PACKAGE

This package will help you to create a boiler plate for creating a new npm package and be hosted into github, with some utils added and CI/CD using github workflows

Utils included and configured:

- Github Workflows:
  - (unit testing on PR into develop and master branch)
  - Auto publishing your package when merging into master
- Typescript
- Jest
- Husky
- Prettier
- ESLint
- Standard-version

## Usage

Start by creating a new repository
and add a repository secret (under the repository settings)
with the name of GH_PACKAGE_TOKEN
the token that you put there needs to have access to read/write packages.
(if you don't have a token yet, you can create one on [https://github.com/settings/tokens](https://github.com/settings/tokens) )

once your repo is ready clone it into your local computer.
then in the root of your empty project run:

```sh
npx create-github-package
```

this will start a wizard of 2 questions
it'll ask you for your username or your organization name.<br/>
It needs to be the same where your repo is hosted.

**your package name needs to be all lower case (if you need spaces use dash)**, if you have upper cases you might encounter errors when publishing.

The script will then install some dependencies, this can take some minutes depending on your internet connection.

once is done, you can start codding!

## Conventional commits

In order for standard release work the best, you need to use conventional commits.
I recommend to use [Commitizen](https://github.com/commitizen/cz-cli), but this is up to you.

## Your first release

for your first release you can work on the master branch, and when you are ready run

```sh
npm run release -- --first-release
```

then push your branch as follow:

```sh
git push --follow-tags origin master
```

this should trigger an automated publishing of your package!

## After your first release

You need to create a develop branch from master and push it.

And branch-out develop for every new change you want to do.
and create PR into develop
when creating the PR to develop, github actions will run unit test.
you should not merge it to develop unless all test have passed.

(tip you can lock the branch until this happen, under the repository settings / branches )

### ready for next release

for the next steps you can keep working on develop or create a release branch and merge develop into release.

Before you deploy you need to run

```sh
npm run release
```

This will bump your package.json package.lock.json and create a git tag
and if you have conventional commits it will create a changelog for you.

once that's done you need to push it with --follow-tags
for example:

```
git push --follow-tags origin develop
```

or

```sh
git push --follow-tags origin release
```

After this create a PR to master. this will again trigger unit testing
once is ready, you can merge into master and this will create a new version of your package.

## Using your package in an external project

the new project needs to have a .npmrc file in the root folder
with:

```

@<<your-user-name>>:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:\_authToken=<<READ_ONLY_TOKEN>>
registry=https://registry.npmjs.com

```

replace \<\<your-user-name>> with your user name or your organization <br/>
and \<\<READ_ONLY_TOKEN>> with a new token with read-only for packages <br />
(if you don't want to store this in the repo, you can use environment variables)
