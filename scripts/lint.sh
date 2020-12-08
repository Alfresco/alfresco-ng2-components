#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/../"

if grep "envalfresco" . -R --exclude-dir={node_modules,.history,.idea,scripts,dist,e2e-output,.git} --exclude={.env,.env.*}; then
    echo not permitted word
    exit 1
fi

nx affected:lint --parallel --all --maxParallel=9 && \
npm run lint-e2e && \
npm run stylelint && \
npm run spellcheck && \
npm run license-checker
