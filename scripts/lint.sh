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

npm run ng -- lint extensions && \
npm run ng -- lint core && \
npm run ng -- lint content-services && \
npm run ng -- lint process-services && \
npm run ng -- lint process-services-cloud && \
npm run ng -- lint insights && \
npm run ng -- lint testing && \
npm run ng -- lint demoshell && \
npm run lint-e2e && \
npm run stylelint && \
npm run spellcheck && \
npm run license-checker
