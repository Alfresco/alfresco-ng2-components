#!/usr/bin/env bash

eval GNU=false

show_help() {
    echo "Usage: smart-build.sh"
    echo ""
    echo "-gnu for gnu"
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

while [[ $1  == -* ]]; do
    case "$1" in
      -gnu) gnu_mode; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

if $GNU; then
 gnu='-gnu'
else
 gnu=''
fi

affected="$(nx affected:libs --base=$BASE_HASH --head=$HEAD_HASH --plain)"
echo $affected
libs=(`echo $affected | sed 's/^$/\n/g'`)

for i in "${libs[@]}"
do
    if [ "$i" == "extensions" ] ; then
        ./scripts/build/build-extensions.sh || exit 1;
    fi
done

for i in "${libs[@]}"
do
    if [ "$i" == "core" ] ; then
        ./scripts/build/build-core.sh || exit 1;
    fi
done

for i in "${libs[@]}"
do
    if [ "$i" == "content-services" ] ; then
        ./scripts/build/build-content-services.sh || exit 1;
    fi
done

for i in "${libs[@]}"
do
    if [ "$i" == "process-services" ] ; then
        ./scripts/build/build-process-services.sh || exit 1;
    fi
done

for i in "${libs[@]}"
do
    if [ "$i" == "process-services-cloud" ] ; then
        ./scripts/build/build-process-services-cloud.sh || exit 1;
    fi
done

for i in "${libs[@]}"
do
    if [ "$i" == "insights" ] ; then
        ./scripts/build/build-insights.sh || exit 1;
    fi
done

for i in "${libs[@]}"
do
    if [ "$i" == "testing" ] ; then
        ./scripts/build/build-testing.sh || exit 1;
    fi
done

for i in "${libs[@]}"
do
    if [ "$i" == "cli" ] ; then
        ./scripts/build/build-cli.sh || exit 1;
    fi
done
