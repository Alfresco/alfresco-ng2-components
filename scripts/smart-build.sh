#!/usr/bin/env bash

eval BRANCH_NAME=""
eval GNU=false

show_help() {
    echo "Usage: smart-build.sh"
    echo ""
    echo "-b branch name"
    echo "-gnu for gnu"
}

branch_name(){
    BRANCH_NAME=$1
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

while [[ $1  == -* ]]; do
    case "$1" in
      -b)  branch_name $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

if [[ "$BRANCH_NAME" == "" ]]
then
    echo "The branch name is mandatory"
    exit 0
fi

if $GNU; then
 gnu='-gnu'
else
 gnu=''
fi

git merge-base origin/$BRANCH_NAME HEAD > ./tmp/devhead.txt;

#reset the tmp folder
affected="$(./scripts/affected-libs.sh ${gnu[@]} -b "$BRANCH_NAME")"
echo $affected
libs=(`echo $affected | sed 's/^$/\n/g'`)

#extensions
for i in "${libs[@]}"
do
    if [ "$i" == "extensions$" ] ; then
        ./scripts/build-extensions.sh || exit 1;
    fi
done

#core
for i in "${libs[@]}"
do
    if [ "$i" == "core$" ] ; then
        ./scripts/build-core.sh || exit 1;
    fi
done

#content-services
for i in "${libs[@]}"
do
    if [ "$i" == "content-services$" ] ; then
        ./scripts/build-content-services.sh || exit 1;
    fi
done

#process-services
for i in "${libs[@]}"
do
    if [ "$i" == "process-services$" ] ; then
        ./scripts/build-process-services.sh || exit 1;
    fi
done

#process-services-cloud
for i in "${libs[@]}"
do
    if [ "$i" == "process-services-cloud$" ] ; then
        ./scripts/build-process-services-cloud.sh || exit 1;
    fi
done

#insights
for i in "${libs[@]}"
do
    if [ "$i" == "insights$" ] ; then
        ./scripts/build-insights.sh || exit 1;
    fi
done

#testing
for i in "${libs[@]}"
do
    if [ "$i" == "testing$" ] ; then
        ./scripts/build-testing.sh || exit 1;
    fi
done
