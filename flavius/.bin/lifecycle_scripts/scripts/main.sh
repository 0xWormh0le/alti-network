#!/bin/bash
set -ev
npm install
if [[ "${GITHUB_REF##*/}" =~ ^heartbeat* ]]
then
  echo "Running HEARTBEAT build scripts"
  . .bin/lifecycle_scripts/scripts/heartbeat.sh
elif [[ "${GITHUB_REF##*/}" =~ ^release-[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
  echo "Running STAGING build scripts"
  . .bin/lifecycle_scripts/scripts/staging.sh
elif [[  ${GITHUB_REF} =~ refs\/tags\/v[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
  echo "Running PRODUCTION build scripts"
  . .bin/lifecycle_scripts/scripts/production.sh
else
  echo "Running DEVELOPMENT build scripts"
  . .bin/lifecycle_scripts/scripts/develop.sh
fi
