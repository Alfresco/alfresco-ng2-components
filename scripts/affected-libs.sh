#!/usr/bin/env bash

eval BRANCH_NAME=""
eval HEAD_SHA_BRANCH=""
eval SHA_2="HEAD"

show_help() {
    echo "Usage: smart-build.sh"
    echo ""
    echo "-b branch name"
}

branch_name(){
    BRANCH_NAME=$1
}

while [[ $1  == -* ]]; do
    case "$1" in
      -b)  branch_name $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

if [[ "$BRANCH_NAME" == "" ]]
then
    echo "The branch name is mandatory"
    exit 0
fi

#HEAD_SHA_BRANCH=(`git merge-base origin/$BRANCH_NAME HEAD`)
HEAD_SHA_BRANCH="$(git merge-base origin/$BRANCH_NAME HEAD)"
echo "Branch name $BRANCH_NAME HEAD sha " $HEAD_SHA_BRANCH

#find affected libs
npm run affected:libs -- $HEAD_SHA_BRANCH "HEAD" > deps.txt
#echo "extensions" > deps.txt

#clean file
sed -i '/^$/d'  ./deps.txt
sed -i '/alfresco-components/d' ./deps.txt
sed -i '/nx affected:libs/d' ./deps.txt
sed -i '/^$/d'  ./deps.txt

#read result from file
while IFS= read -r var
do
    fileLine=$var
done < "./deps.txt"

#transform string to array
libs=(`echo $fileLine | sed 's/^$/\n/g'`)

#core
for i in "${libs[@]}"
do
    if [ "$i" == "core" ] ; then
        AFFECTED_LIBS="core$ content-services$ process-services$ process-services-cloud$ insights$ extensions$ "
        rm deps.txt
        echo "${AFFECTED_LIBS}"
        exit 0
    fi
done

#process-services
for i in "${libs[@]}"
do
    if [ "$i" == "process-services" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" process-services$"
    fi
done

#content-services
for i in "${libs[@]}"
do
    if [ "$i" == "content-services" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" content-services$"
    fi
done

#insights
for i in "${libs[@]}"
do
    if [ "$i" == "insights" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" insights$"
    fi
done

#extensions
for i in "${libs[@]}"
do
    if [ "$i" == "extensions" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" extensions$"
    fi
done

#process-services-cloud
for i in "${libs[@]}"
do
    if [ "$i" == "process-services-cloud" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" process-services-cloud$"
    fi
done

rm deps.txt
echo "${AFFECTED_LIBS}"
