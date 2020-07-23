#!/usr/bin/env bash


show_help() {
    echo "Usage: ./scripts/lint.sh -ban word_to_ban"
    echo ""
    echo "-ban (optional)"
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/../"

if grep "envalfresco" . -R --exclude-dir={node_modules,.history,.idea,scripts,dist,e2e-output} --exclude={.env,.env.*}; then
    echo not permitted word
    exit 1
fi

nx lint

nx affected:lint --all --parallel && \
npm run lint-e2e && \
npm run stylelint && \
npm run spellcheck && \
npm run license-checker
