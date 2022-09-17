#!/bin/bash
export NODE_ENV=staging
npm run test-no-watch
npm run lint
npm run build-staging
npm run gzip