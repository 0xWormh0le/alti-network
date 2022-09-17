#!/bin/bash
export NODE_ENV=production
npm run test-no-watch
npm run lint
npm run build
npm run gzip