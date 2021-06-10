#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/../"

if grep "envalfresco" . -R --exclude-dir={node_modules,.history,.idea,scripts,dist,e2e-output,.git} --exclude={.env,.env.*}; then
    echo not permitted word
    exit 1
fi

echo "Lint"
nx affected:lint --parallel --all --maxParallel=9

echo "Style Lint"
npm run stylelint

echo "Spell check"
npm run spellcheck

echo "License check"
npm run license-checker
npm run validate-config
