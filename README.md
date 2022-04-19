# Medle

MedLé is a platform for french hospitals to declare their medico-legal activity.

## 👔 Install

> Since april 2021, Medlé is deployed by Gitlab on Kubernetes. The instructions with docker-compose are kept for reference.

As a prerequisite, install git, yarn, docker, docker-compose with [brew](https://brew.sh/) on Mac OS.

First, you need a database. A docker container is made for that.

You only have to run the db container (and not the app): `docker-compose up --build -d db`

Then, the DB is exposed on port 5434 and the app is accessible on port 80.

Next, you have to create the database named medle and the app user.
At start, there is a user with the name `user` and the password `password`.

So, connect to the db container : `psql postgres://user:password@localhost:5436`
Alternatively, if you don't have `psql` CLI, you can use : `docker exec -it medle_db_1 psql -U user`

Create the medle database and the user medle with the password of your choice.

```sql
create user medle with encrypted password 'jJFWsfW5ePbN7J';
create database medle with owner medle encoding 'UTF8';
alter user medle with superuser;
```

Alternatively, if you have create in other way a Postgres user :

```sql
grant all privileges on database medle to other-user
```

Set some environment variables (see next paragraph how) for accessing this Postgres server :
For DATABASE_URL, be sure to use the matching password you have just created before.

For example :
```
DATABASE_URL=psql://medle:jJFWsfW5ePbN7J@db:5432/medle
POSTGRES_SSL=false
```

Then run the container app :

`docker-compose up --build -d app`

This will run the HTTP server and run automatically the Knex migrations to create the tables in DB.

Optionnaly, in test environements, you may want to populate some data. Run Knex seeds for that :

`docker-compose exec app yarn seed:run:dev`

This is supposed to work now! ✨

### 🎛️ Env vars

As previously said, you need to set `process.env` variables.

Usually, the easiest solution to set the variables is to populate the `.env` file at the project's root.

A blueprint of `env` can be seen with the file `.env.sample`.

The variables are :

- NODE_ENV=development or production
- API_URL URL of the api (in local, it's http://localhost:3000/api)
- APP_BASE_URL Base URL of the app (in local, it's http://localhost:3000)
- POSTGRES_SSL mode to connect to Postgres (false in local,  true for for Azure hosted)
- DATABASE_URL URL of Postgres DB
- JWT_SECRET the secret for generating JWT tokens
- MATOMO_SITE_ID site id on piwik instance
- MATOMO_URL URL to your piwik instance
- SENTRY_DSN DSN of your sentry project
- MAIL_HOST SMTP host for mailing
- MAIL_PORT port for SMTP server
- MAIL_USERNAME username of SMTP server account
- MAIL_PASSWORD password of SMTP server account
- MAIL_FROM string used in from email
- LOGIN_DELAY_ATTEMPTS number of attempts to start the login delay
- LOGIN_DELAY_SECONDS duration of the login delay

Besides, in some cases you may want to set :

- DEBUG used to debug Knex (ex: knex:query to show SQL queries)
- DEBUG_MODE set to true to console.debug
- TEST_CURRENT_DATE useful to set a date in the past and have consistent result for tests using dates
- E2E_JEST_DATABASE_URL URL of Postgres DB for E2E tests


## 🏗️ Development usage

In local development usage, you don't have to use docker-compose for all the ops stuff.

For example, you can manually apply the last migration in db with : `yarn migrate:latest`.

And a minimal set of data : `yarn seed:run:dev`

Second, the front office in Next. With `yarn dev`, you will benefit from the hot reload/fast refresh offered by Next.

With this configuration, the API will run on `localhost:3000` and the database will be a Docker container running on your machine.

Now run `yarn` to install the dependencies, then `yarn dev`.

At the end, the app is running at http://localhost:3000.

*Nota bene*

Be careful. If you use the app from the container (as we advise you), it is considered inside the docker network.
So you have to use an DATABASE_URL with __5432__ port, like `DATABASE_URL=psql://medle:bHrdeGk63cHQa7@db:5432/medle`.

On the other hand, when you use `yarn dev`, the node process is on localhost and is therefore outside the docker network.
In this case, you need to use a DATABASE_URL with __5434__ port, like `DATABASE_URL=psql://medle:bHrdeGk63cHQa7@localhost:5434/medle`.

Don't forgete also that in Docker, the db is not in non SSL mode.
So the `POSTGRES_SSL` must be set to false.

With a managed Postgres, `POSTGRES_SSL` must be set to true.

## 🌱 Migration and seeds

The database structure is able to evolve thanks to Knex.js migrations.

To initiate a migration, the easiest way is to use `migrate:make` script in package.json.

```shell
yarn knex migrate:make my-name-of-migration
```

Modify it accordingly to your business needs.

To apply it, use `migrate:latest` script in package.json.

In development mode : `yarn migrate:latest`

If you're not happy with the migration done, you can rollback with the script `migrate:rollback` in package.json.
It will then rollback all the migration files with the biggest batch number (column `batch` in knex_migrations).

Alternatively, if you are in VM mode :

```bash
sudo docker-compose exec app yarn migrate:latest
sudo docker-compose exec app yarn migrate:rollback
```

On the development platform (local or staging environment), you may need to populate table in JS (you may yet do it directly with SQL client too).

Make a new seed file, in src/knex/seeds/development or src/knex/seeds/staging, then:

In development mode, for applying the development seeds:
`yarn seed:run:dev`

In VM mode, for applying the staging seeds:
`sudo docker-compose exec app yarn seed:run:staging`

Never, never, never <strike>give up</strike> apply this seeds in real production environment (under penalty of fetching a Postgres backup in Azure 😭).

Knex migration tips: https://medium.com/@j3y/beyond-basic-knex-js-database-migrations-22263b0fcd7c

### Migrations organization

For migraton involving a table (creation, modificaton including index management, trigger management, etc.), this should be done in the directory src/knex/migrations like the file 20200317163657_create_indexes.js for example.

For migrations involving a stored function or procedure, a view, materialized or not, this should be done in directory src/knex/versions, with a version number, with the master migration file mentioning it.

For example, see this migration file named `20200312161718_create_function_avg_acts.js`:

```js
const v1 = require("../versions/functions/avg_acts/v1")

exports.up = async function(knex) {
   await knex.raw(v1.up)
}

exports.down = async function(knex) {
   await knex.raw(v1.down)
}
```

This way allows us to see the entire history of things like functions or views, which can be totally removed and recreated.

## 🧪 How to test

In development mode:
1. `yarn dev`
2. `yarn seed:run:staging` (will remove all data on env.DATABASE_URL and reset with the default data)
3. `yarn test` (will use env.API_URL for tests involving API endpoints)

In staging mode:
1. `sudo docker-compose up --build -d app`
2. `sudo docker-compose exec app yarn seed:run:staging` (will remove all data on env.DATABASE_URL and reset with the default data)
3. `sudo docker-compose exec app yarn test` (will use env.API_URL for tests involving API endpoints)

## 🗂️ Main src directories

- clients: the API clients for the frontend
- components: React component
- faq: the mdx file for dynamically populating the FAQ page
- knex: all Knex database backend stuff
- models: the transformer of data, between the database format to/from JSON format used in the frontend
- pages: Next page
- pages/api: API endpoints
- services: services for the backend (for API)
- theme: CSS theme
- utils: utilities functions necessary for frontend and backend

## 🖋️ Conventions for commit messages

You need to use the commit lint convention for commit message.

I.e, you must specify a type in prefix position, for the message using one of the following:

NB : The Gitlab CI configuration uses semantic release. If you want to have automatically a new release, the commit must begin with `feat:` or `fix:`.

- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- ci: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests
- chore: for tedious and necessary work, not listed before (try to minimize the use of this umbrella term)

As a reference see https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular.

## Conventions for closing automatically issues

Add in commit message "Closes #123" where 123 is the issues's id to close.

## 📈 Matomo

`trackEvent(category, action, [name], [value])`

avec :
- category/action:
    - acte
        - déclaration
        - suppression
        - modification
        - lecture
    - etp
        - déclaration
        - modification
        - validation annuelle
    - stat
        - lecture vivant
        - lecture thanato
        - lecture globale
    - authentification
        - connexion
        - déconnexion
        - erreur

## Annex

### Add askers reminder

```sql
INSERT INTO askers (name, type) VALUES ('CRS autoroutière', 'primary');
```

