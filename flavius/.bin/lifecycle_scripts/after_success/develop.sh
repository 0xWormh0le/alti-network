#!/bin/bash
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_DEV
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_DEV
aws s3 sync ./build s3://flavius-web-app-development
aws cloudfront create-invalidation --distribution-id $CF_DISTRO_ID_FLAVIUS_DEV --paths "/*"
npm run update-sentry