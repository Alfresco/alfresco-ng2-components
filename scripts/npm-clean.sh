#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
components_dir="$DIR/../ng2-components"

for comp_dir in $( ls "$components_dir" ); do
  test -f "$components_dir/$comp_dir/package.json" && \
    cd "$components_dir/$comp_dir" && \
    echo "====== clean component: ${$comp_dir} =====" && \
    npm run clean
done

cd "$DIR/../demo-shell-ng2"
npm run clean

cd ${DIR}
