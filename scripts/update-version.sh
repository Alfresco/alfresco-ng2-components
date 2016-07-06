#!/usr/bin/env bash

set -ex

cd `dirname $0`

VERSION=$1

if [[ "${VERSION}" == "" ]]
then
  echo "Version number required"
  exit 1
fi

echo "====== RENAMING 0.0.0-PLACEHOLDER to N.N.N version ======"
find ././../ -type f -name package.json -print0 | xargs -0 sed -i '' "s/0\\.0\\.0-PLACEHOLDER/${VERSION}/g"