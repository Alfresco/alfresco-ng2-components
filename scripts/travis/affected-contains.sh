#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
verifyLib=$1;
cd $DIR/../../

AFFECTED_LIBS="$(nx print-affected --type=lib --select=projects --base=$BASE_HASH --head=$HEAD_HASH --plain || exit 1)"
echo "Verify if affected build contains $1"


echo "Affected libs:$AFFECTED_LIBS"
if [[  $AFFECTED_LIBS =~ $verifyLib ]]; then
    echo "Yep project:$verifyLib is affected carry on"
    exit 0
else
    echo "Nope project NOT affected save time"
     exit 1
fi;
