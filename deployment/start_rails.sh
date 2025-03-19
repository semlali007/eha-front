#!/usr/bin/env bash

set -e

if ! whoami &> /dev/null; then
  if [ -w /etc/passwd ]; then
    export USER_NAME=${USER_NAME:-default}
    export HOME=/home/${USER_NAME}
    echo "${USER_NAME}:x:$(id -u):0:${USER_NAME} user:${HOME}:/sbin/nologin" >> /etc/passwd
  fi
fi

umask 002 # Needed for double run in Openshift 3 and 4 when sharing NAS

until PGPASSWORD=$POSTGRES_PASSWORD psql -d "$POSTGRES_DB" -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -p "$POSTGRES_PORT" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres available"

until (echo > /dev/tcp/"${ELASTICSEARCH_HOST}/${ELASTICSEARCH_PORT}") &> /dev/null; do
    echo "zammad railsserver waiting for elasticsearch server to be ready..."
    sleep 60
done

echo "Elasticsearch available"

# check if database exists / update to new version
echo "initialising / updating database..."
if ! (bundle exec rails r 'puts User.any?' 2> /dev/null | grep -q true); then
  echo "db not found, creating ..."
  #bundle install
  if [ "${POSTGRESQL_DB_CREATE}" == "true" ]; then
    bundle exec rake db:create
  fi
  bundle exec rake db:migrate
  bundle exec rake db:seed
  # create autowizard.json on first install
  if base64 -d <<< "${AUTOWIZARD_JSON}" &>> /dev/null; then
    echo "Saving autowizard json payload..."
    base64 -d <<< "${AUTOWIZARD_JSON}" > "${AUTOWIZARD_RELATIVE_PATH}"
  fi
else
  echo "db found, running startup scripts..."
  echo Clearing cache...
  bundle exec rails r "Rails.cache.clear"
  echo Executing migrations...
  bundle exec rake db:migrate
  echo Synchronizing locales...
  bundle exec rails r "Locale.sync"
  #echo Synchronizing translations...
  #bundle exec rails r "Translation.sync"
fi

echo "installing yarn ..."
npm set registry $NPM_MIRROR
npm install --global yarn
yarn config set npmRegistryServer $NPM_MIRROR

echo "starting websocket server..."

bundle exec puma -b tcp://0.0.0.0:3000 -e ${RAILS_ENV}
