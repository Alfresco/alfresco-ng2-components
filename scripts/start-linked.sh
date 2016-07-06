#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

"$DIR/npm-link-demo-shell.sh"

cd "$DIR/../demo-shell-ng2"

if  [[ $1 = "-install" ]]; then
    npm install
    npm run start
elif  [[ $1 = "-update " ]]; then
    npm run update
    npm run start
elif  [[ $1 = "-cleanInstall" ]]; then
    npm run clean
    npm install
    npm run start
else
    npm run start
fi
