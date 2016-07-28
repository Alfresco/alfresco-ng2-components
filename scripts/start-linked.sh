#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

"$DIR/npm-link-demo-shell.sh"
"$DIR/npm-build-all.sh"
"$DIR/start.sh" $@
