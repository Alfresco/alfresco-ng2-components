#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
components_dir="$DIR/../ng2-components"

for comp_dir in $( ls "$components_dir" ); do
  echo $comp_dir
  test -f "$components_dir/$comp_dir/package.json" && \
    cd "$components_dir/$comp_dir" && \
    npm run build
done

cd ${DIR}
