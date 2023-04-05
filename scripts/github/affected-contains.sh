#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
verifyLib=$1;
deps=$2;
cd $DIR/../../

if [ "${GITHUB_EVENT_NAME}" == "schedule" ]; then
  #echo "Affected not check in case of cron"
  echo true
  exit 0
fi
isAffected=false
AFFECTED_LIBS=$(npx nx print-affected --type=lib --select=projects ${NX_CALCULATION_FLAGS} --plain)
#echo "Verify if affected build contains $1"
#echo "Affected libs:$AFFECTED_LIBS"
if [[  $AFFECTED_LIBS =~ $verifyLib ]]; then
#echo "Yep project:$verifyLib is affected carry on"
    isAffected=true
fi;

if [[ $isAffected == false ]]; then
#    echo "Read the deps as array"
    IFS=',' read -ra depsArray <<< "$deps"

#echo "Loop through the deps to check if they are affected"
    for i in "${depsArray[@]}"
        do
            if [[ $AFFECTED_LIBS =~ $i ]]; then
                isAffected=true;
                break
            fi;
        done;
fi;

echo $isAffected;
