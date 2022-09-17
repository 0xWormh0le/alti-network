#!/bin/bash
export NODE_ENV=dev
npm run test-no-watch
npm run lint
npm run build-dev