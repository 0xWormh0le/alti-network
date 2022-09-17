#!/bin/bash
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID_STAGING
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY_STAGING
aws s3 sync ./build s3://altitude-staging-web-app --exclude="*.gz" --exclude="**/*.gz"
aws s3 sync ./build s3://altitude-staging-web-app --exclude="*" --include="*.gz" --include="**/*.gz" --content-encoding gzip
aws cloudfront create-invalidation --distribution-id $CF_DISTRO_ID_FLAVIUS_STAGING --paths "/*"
npm run update-sentry