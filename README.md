# medle
MedLé :  plateforme permettant aux établissements de santé de déclarer leur activité médico-légale

## Install

Prerequisite : install a Postgres DB, named `medle`.

```js
yarn install
```

## Run

```js
yarn dev
```

## Type for commit messages

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

as a reference see https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular

## Close automatically issues

Add in commit message "Closes #123" where 123 is the issues's id to close.

For example, This closes #34, closes #23, and closes example_user/example_repo#42 would close issues #34 and #23 in the same repository, and issue #42 in the "example_user/example_repo" repository.


## Docker build

```shell
docker build --build-arg SENTRY_DSN="https://[hash]@url.sentry.com/42" --build-arg SENTRY_TOKEN="1234" --build-arg MATOMO_URL="https://url.matomo.com" --build-arg MATOMO_SITE_ID=42 --build-arg POSTGRES_HOST="192.168.1.18" . -t medle
```

## Docker run

```shell
docker run -it --init --rm -p 3001:3000 medle
```

## Create knex migration file

```shell
NODE_ENV=development yarn knex migrate:make init_schema --cwd ./src/knex
```

## Run migrations

```
git pull
sudo docker-compose up --build -d
sudo docker-compose exec app yarn migrate:latest
```

## Run seeds

sudo docker-compose exec app yarn seed:run

## TimeZone

`SET timezone = 'posix/Europe/Paris';
select now();

SET timezone = 'UTC';
select now();`


## Ajouter un user en base de données

`INSERT INTO USERS (first_name, last_name, email, password, role, hospital_id, scope)
VALUES ('Dominique', 'Cormier', 'dom.cormier@gmail.com', 'password-with-bcrypt', 'OPERATOR_ACT', 1, null);`

`INSERT INTO USERS (first_name, last_name, email, password, role, hospital_id, scope)
VALUES ('Dominique', 'Cormier', 'dom.cormier@gmail.com', 'password-with-bcrypt', 'OPERATOR_EMPLOYMENT', 1, null);`

`INSERT INTO USERS (first_name, last_name, email, password, role, hospital_id, scope)
VALUES ('Marc', 'Legrand', 'marc.legrand@yahoo.fr', 'password-with-bcrypt', 'REGIONAL_SUPERVISOR', null, {1, 2, 3});`

Use bcrypt generator, like : https://www.browserling.com/tools/bcrypt

## Patch DB

Dans le cas où la définition des actes changent dans leur version existante (le nom d'un profil change ou bien une des réponses possibles d'une rubrique existante est modifiée), la page de déclaration d'acte ne va pas réussir à lire toutes les catégories ou les valeurs. Pour un profil, cela aboutira à une erreur. Pour une valeur de rubrique, qui change (ex: le genre de la personne passe de "Autre" à "Autre genre"), pour les actes qui ont l'ancienne valeur (Autre), rien ne sera coché dans cette rubrique. Pas d'erreur donc mais un fonctionnement non optimal.

Pour corriger cela, il faut modifier la base de données et la colonne JSONB `extra_data` avec des requêtes du type :

- changement d'un libellé de profil: `le profil 'Victime' devient 'Victime (vivante)'`

```sql
update acts set profile = 'Victime (vivante)' where profile = 'Victime'
```

- changement d'une valeur pour une catégorie qui ne prend qu'une seule réponse `Le genre "Autre" devient "Autre genre"`
```sql
update acts
set extra_data = extra_data - 'personGender' || '{"personGender": "Autre genre"}'
where extra_data->'personGender' ? 'Autre'
```

- ajouter une valeur à une propriété de type array `Ajouter à violenceTypes la valeur "Voie publique", là où il y a la valeur "Familiale"`
```sql
update acts
set extra_data = jsonb_set(extra_data, '{violenceTypes}', (extra_data->'violenceTypes') || '["Voie publique"]')
where extra_data->'violenceTypes' ? 'Familiale'
```

- changement d'une valeur pour une catégorie prenant potentiellement plusieurs réponses `le type de violence "Voie publique" devient "Sur voie publique"`

```sql
update acts
set extra_data = jsonb_set(extra_data, '{violenceTypes}', ((extra_data->'violenceTypes') - 'Voie publique') || '["Sur voie publique"]')
where extra_data->'violenceTypes' ? 'Voie publique'
```

À contrario, ajouter une rubrique à la déclaration d'acte ou une valeur, sera accepté sans problème.