#!/usr/bin/env bash


show_help() {
    echo "Usage: ./scripts/lint.sh -ban word_to_ban"
    echo ""
    echo "-ban (optional)"
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/../"

echo "====== Parallel lint ====="

npx concurrently -s "all" "npm run lint-lib || exit 1" "npm run stylelint || exit 1" "npm run spellcheck || exit " "ng lint dev || exit 1" "npm run lint-e2e || exit 1" || exit 1

if grep "envalfresco" . -R --exclude-dir={node_modules,.history,.idea,scripts}; then
    echo not permitted word
    exit 1
fi
