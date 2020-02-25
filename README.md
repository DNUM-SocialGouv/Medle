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

Then create/modify an `.env` file in the root of the project (see `.env.sample` as a reference).

For DATABASE_URL, be sure to use the matching password you have just created before.

```js
NODE_ENV=development

API_URL=http://localhost/api

POSTGRES_USER=medle
POSTGRES_PASSWORD=jJFWsfW5ePbN7J

# API variables

# for container app usage (like production)
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

For development purpose, it is more handy to use `yarn dev` to benefit from the hot reload offered by Next.

So, you only run the db container
`docker-compose up --build -d db`

Modify `.env` for APP_API
```js
API_URL=http://localhost:3000/api
```

Now run `yarn` to install the dependencies, then `yarn dev`.

At the end, the app is running at http://localhost:3000.

*Nota bene*

Be careful. If you use the app from the container, it is considered inside the docker network.
So you have to use an DATABASE_URL with __5432__ port, like `DATABASE_URL=psql://medle:bHrdeGk63cHQa7@db:5432/medle`.

On the other hand, when you use `yarn dev`, the node process is on localhost and is therefore outside the docker network.
In this case, you need to use a DATABASE_URL with __5434__ port, like `DATABASE_URL=psql://medle:bHrdeGk63cHQa7@localhost:5434/medle`.

## 🌱 Migration and seeds

The database structure may evolve thanks to Knex.js migrations.

To initiate a migration, the easiest way is to use `migrate:make` script in package.json.

```shell
NODE_ENV=development yarn knex migrate:make init_schema --cwd ./src/knex
```

Modify it accordingly to the business needs.

To apply it, use `migrate:latest` script in package.json.

`sudo docker-compose exec app yarn migrate:latest`

So on another platform like production, the pattern is:

```sh
git pull
sudo docker-compose up --build -d
sudo docker-compose exec app yarn migrate:latest
```

If you're not happy with the migration done, you can rollback with the script `migrate:rollback` in package.json.

`sudo docker-compose exec app yarn migrate:rollback`

On the development platform, you may need to populate table in JS (you may yet do it directly with SQL client too).

Make a new seed file, then:

`sudo docker-compose exec app yarn seed:run`


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

As a reference see https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular.

## Conventions for closing automatically issues

Add in commit message "Closes #123" where 123 is the issues's id to close.

## Matomo

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