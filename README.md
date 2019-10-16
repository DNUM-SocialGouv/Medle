# medle
MedLé :  plateforme permettant aux établissements de santé de déclarer leur activité médico-légale

## Type for commit messagee

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