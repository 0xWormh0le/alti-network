#!/bin/bash
echo "Running ${RELEASE_ENV} after_success scripts"
if [[ "${GITHUB_REF##*/}" =~ ^heartbeat* ]]
then
  . .bin/lifecycle_scripts/after_success/heartbeat.sh
elif [[ "${GITHUB_REF##*/}" =~ ^release-[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
  . .bin/lifecycle_scripts/after_success/staging.sh
elif [[  ${GITHUB_REF} =~ refs\/tags\/v[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
  . .bin/lifecycle_scripts/after_success/production.sh
elif [[ "${GITHUB_REF##*/}" =~ ^develop$ ]]
then
  . .bin/lifecycle_scripts/after_success/develop.sh
else
  echo "Skipping 'after_success' deployment for branch ${GITHUB_REF##*/}"
fi