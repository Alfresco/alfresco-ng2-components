#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

export NODE_OPTIONS=--max_old_space_size=8192

if [ "$CI" = "true" ]; then
    echo "Building extensions for production"
    nx build extensions --prod || exit 1
else
    echo "Building extensions for development"
    nx build extensions || exit 1
fi
