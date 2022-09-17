#!/bin/bash
if [[ ${RELEASE_ENV} = heartbeat ]]
then
  echo "Running ${RELEASE_ENV} after_success scripts"
  . .bin/lifecycle_scripts/after_failure/heartbeat.sh
fi