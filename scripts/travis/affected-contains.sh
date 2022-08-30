#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
verifyLib=$1;
cd $DIR/../../

if [ "${TRAVIS_EVENT_TYPE}" == "cron" ]; then
  #echo "Affected not check in case of cron"
  echo false
fi
AFFECTED_LIBS="$(nx print-affected --type=lib --select=projects --uncommitted --plain)"
#echo "Verify if affected build contains $1"


#echo "Affected libs:$AFFECTED_LIBS"
if [[  $AFFECTED_LIBS =~ $verifyLib ]]; then
    #echo "Yep project:$verifyLib is affected carry on"
    echo true
else
    #echo "Nope project NOT affected save time"
    echo false
fi;
