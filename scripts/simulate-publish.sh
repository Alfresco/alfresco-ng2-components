#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm set registry https://registry.npmjs.org/

echo "====== Install verdaccio ===== "

npm install -g verdaccio
npm install -g concurrently
npm install -g verdaccio-auth-memory

echo "====== Update version ===== "

$DIR/update-version.sh -nextbeta -components

echo "====== Change registry ===== "

npm set registry http://localhost:4873/

echo "====== Run verdaccio ===== "

concurrently "verdaccio --listen 4873 --config $DIR/config/config-verdaccio.yaml" "$DIR/npm-publish.sh --sleep 20 -f"
