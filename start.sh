#!/usr/bin/env sh

if [ "$NODE_ENV" = "prod" ] ; then
  echo "Prod mode"
  npm install --production && npm cache clean --force --loglevel=error
  node /app/console/commands/migrate.js
  node ./bin/www
else
  echo "Dev mode"
  npm install && npm cache clean --force --loglevel=error
  node /app/console/commands/migrate.js
  node ./bin/www
fi;