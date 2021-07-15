#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..


if [ "$CI" = "true" ]; then
    echo "Building extensions for production"
    NODE_OPTIONS="--max-old-space-size=8192" nx build extensions --configuration production || exit 1
else
    echo "Building extensions for development"
    NODE_OPTIONS="--max-old-space-size=8192" nx build extensions || exit 1
fi
