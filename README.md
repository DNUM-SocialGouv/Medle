# Medle

MedLé is a platform for french hospitals to declare their medico-legal activity.

## 👔 Install

First, install git, yarn, docker, docker-compose with [brew](https://brew.sh/) on Mac OS.

Then, run the containers with `docker-compose`.

`docker-compose up --build -d`

Then, the DB is exposed on port 5434 and the app is accessible on port 80.

Connect to the DB via a Postgresql client. For start, there a user with the name `user` and the password `password`.

`docker exec -it medle_db_1 psql -U user`

Create the medle database and the user medle with the password of your choice.

```sql
create database medle;
create user medle with encrypted password 'jJFWsfW5ePbN7J';
grant all privileges on database medle to medle
```

Then create/modify an `.env` file in the root of the project (see `.env.dev` as a reference).

For DATABASE_URL, be sure to use the matching password you have just created before.

```js
NODE_ENV=development

API_URL=http://localhost/api

# for container app usage
POSTGRES_SSL=false
DATABASE_URL=psql://medle:jJFWsfW5ePbN7J@db:5432/medle

# JWT
JWT_SECRET=NEGLaRS3n9JHuY

# Test variables
#TEST_CURRENT_DATE=10/09/2019
```

Then rerun the container app, to force usage of this `.env` file.
`docker-compose up --build -d app`

This is supposed to work now!


## 🏗️ Development usage

First, you need a database. A docker container is made for that.

You only have to run the db container (and not the app): `docker-compose up --build -d db`

Next, you have to create the database named medle and the app user.

So, connect to the db container : `psql postgres://user:password@localhost:5436`

```sh
create user medle with encrypted password 'test';
create database medle with owner medle encoding 'UTF8';
alter user medle with superuser;
```

Now, you will build the tables of the medle db : `yarn migrate:latest`.

And a minimal set of data : `yarn seed:run:dev`

Second, the front office in Next. With `yarn dev`, you will benefit from the hot reload offered by Next.
Just copy the file `.env.dev` given as reference and named it as `.env` to be used by dotenv.

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

Modify it accordingly to the business needs.

To apply it, use `migrate:latest` script in package.json.

In development mode
`yarn migrate:latest`

In production mode
`sudo docker-compose exec app yarn migrate:latest`

So on another platform like production, the pattern is:

```sh
git pull
sudo docker-compose up --build -d
sudo docker-compose exec app yarn migrate:latest
```

If you're not happy with the migration done, you can rollback with the script `migrate:rollback` in package.json.

`sudo docker-compose exec app yarn migrate:rollback`

On the development platform (local or staging environment), you may need to populate table in JS (you may yet do it directly with SQL client too).

Make a new seed file, in src/knex/seeds/development or src/knex/seeds/staging, then:

In development mode, for applying the development seeds:
`yarn seed:run:dev`

In production mode, for applying the staging seeds:
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

