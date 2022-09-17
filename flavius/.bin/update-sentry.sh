#!bin/bash

export SENTRY_ORG=altitude-networks
export SENTRY_PROJECT=flavius
RELEASE_NAME=flavius@${npm_package_version}

npx sentry-cli releases new $RELEASE_NAME --finalize --log-level=debug
npx sentry-cli releases deploys $RELEASE_NAME new -e $NODE_ENV --log-level=debug
npx sentry-cli releases files $RELEASE_NAME upload-sourcemaps build/static/js --validate --rewrite --log-level=debug
