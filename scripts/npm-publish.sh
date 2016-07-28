#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
components_dir="$DIR/../ng2-components"

"$DIR/npm-clean.sh"

for comp_dir in $( ls "$components_dir" ); do
  test -f "$components_dir/$comp_dir/package.json" && \
    cd "$components_dir/$comp_dir" && \
    echo "====== PUBLISHING: ${$comp_dir} =====" && \
    npm install && \
    npm publish
done
