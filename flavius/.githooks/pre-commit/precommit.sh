#!/bin/sh
branch=$(git rev-parse --symbolic --abbrev-ref $1)

if [[ "$branch" =~ ^release* ]]; then npm run coverage; fi

node ./node_modules/pretty-quick/bin/pretty-quick --staged
