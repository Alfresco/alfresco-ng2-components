#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/../"

echo "====== lint Lib ====="

npm run lint-lib || exit 1

echo "====== lint E2E ====="

npm run lint-e2e || exit 1

echo "====== lint Demo shell ====="

ng lint dev || exit 1

echo "====== spellcheck ====="

npm run spellcheck || exit 1

echo "====== styleLint ====="

npm run stylelint || exit 1

echo "====== exclude-word ====="

if grep "envalfresco" . -R --exclude-dir={node_modules,.history,.idea,scripts}; then
    echo not permitted word
    exit 1
fi
