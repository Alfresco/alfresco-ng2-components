#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/../"

if grep "envalfresco" . -R --exclude-dir={node_modules,.history,.idea,scripts,dist,e2e-output,.git} --exclude={.env,.env.*}; then
    echo not permitted word
    exit 1
fi

echo "Lint"
nx affected:lint --parallel --all --maxParallel=9 || exit 1

echo "Style Lint"
npm run stylelint  || exit 1

echo "Spell check"
npm run spellcheck  || exit 1

echo "License check"
npm run license-checker  || exit 1
npm run validate-config  || exit 1
