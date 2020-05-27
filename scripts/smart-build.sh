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

echo "The branch name to check is $BRANCH_NAME"

if $GNU; then
 gnu='-gnu'
else
 gnu=''
fi

if [ $BRANCH_NAME == "undefined" ]; then
    echo "Rebase your branch"
    exit 1
fi

#reset the tmp folder
affected="$(./scripts/affected-libs.sh ${gnu[@]} -b "$BRANCH_NAME")"
echo $affected
libs=(`echo $affected | sed 's/^$/\n/g'`)

echo "Builds"

for i in "${libs[@]}"
do
    if [ "$i" == "extensions$" ] ; then
        ./scripts/build/build-extensions.sh || exit 1;
    fi

    if [ "$i" == "core$" ] ; then
        ./scripts/build/build-core.sh || exit 1;
    fi

    if [ "$i" == "content-services$" ] ; then
        ./scripts/build/build-content-services.sh || exit 1;
    fi

    if [ "$i" == "process-services$" ] ; then
        ./scripts/build/build-process-services.sh || exit 1;
    fi

    if [ "$i" == "process-services-cloud$" ] ; then
        ./scripts/build/build-process-services-cloud.sh || exit 1;
    fi

    if [ "$i" == "insights$" ] ; then
        ./scripts/build/build-insights.sh || exit 1;
    fi

    if [ "$i" == "testing$" ] ; then
        ./scripts/build/build-testing.sh || exit 1;
    fi

    if [ "$i" == "cli$" ] ; then
        ./scripts/build/build-cli.sh || exit 1;
    fi
done
