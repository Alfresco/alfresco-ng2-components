#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
components_dir="$DIR/../ng2-components"

npm_opts="--loglevel=silent"

function link_alfresco_ng2_deps() {
  cd $1
  for dep in $( list-dependencies '^ng2-(alfresco|activiti)-' ); do
    npm link --ignore-scripts $npm_opts "$dep"
  done
}

npm install $npm_opts -g typings
npm install $npm_opts -g @wabson/list-dependencies

# First link each component into /usr/local/lib/node_modules
for comp_dir in $( ls "$components_dir" ); do
  echo "Link $components_dir/$comp_dir"
  test -f "$components_dir/$comp_dir/package.json" && cd "$components_dir/$comp_dir" && npm link --ignore-scripts
done

# Now link inter-dependencies between components
for comp_dir in $( ls "$components_dir" ); do
  echo "Link dependencies of $components_dir/$comp_dir"
  test -f "$components_dir/$comp_dir/package.json" && link_alfresco_ng2_deps "$components_dir/$comp_dir"
done

# Now run postinstall scripts
for comp_dir in $( ls "$components_dir" ); do
  echo "Postinstall $components_dir/$comp_dir"
  test -f "$components_dir/$comp_dir/package.json" && cd "$components_dir/$comp_dir" && npm run postinstall
done

# LINK ALL THE COMPONENTS INSIDE THE DEMOSHELL
link_alfresco_ng2_deps "$DIR/../demo-shell-ng2"
