# News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Dotenv

Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. As `.env.*` is added to the `.gitignore`, anyone who wishes to clone the repo will not have access to the necessary environment variables. So, as a developer, you will need to create two `.env` files for your project: `.env.test` and `.env.development` (you can look at the `.env-example` file as an example). This creates two separate environments, one for production, and one for development. Inside each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see /db/setup.sql for the database names). This will successfully connect to the two databases locally and depending on what command you are running, the correct enviroment will be deployed.




## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project as well as creating your own custom hooks.\_
