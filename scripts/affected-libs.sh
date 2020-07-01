#!/usr/bin/env bash

eval BRANCH_NAME=""
eval HEAD_SHA_BRANCH=""
eval DIRECTORY="tmp"
eval GNU=false

show_help() {
    echo "Usage: affected-libs.sh"
    echo ""
    echo "-b branch name"
    echo "-gnu for gnu"
}

gnu_mode() {
    GNU=true
}

branch_name(){
    BRANCH_NAME=$1
}

while [[ $1  == -* ]]; do
    case "$1" in
      -b)  branch_name $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

if $GNU; then
 sedi='-i'
else
 sedi=('-i' '')
fi


if [[ "$BRANCH_NAME" == "" ]]
then
    echo "The branch name is mandatory"
    exit 0
fi

# tmp folder doesn't exist.
if [ ! -d "$DIRECTORY" ]; then
  #find affected libs
  echo "Directory tmp created";
  mkdir $DIRECTORY;
fi

HEAD_SHA_BRANCH="$(git merge-base origin/$BRANCH_NAME HEAD)"

if [ ! -f $DIRECTORY/deps.txt ]; then
    npm run affected:libs -- --base=$HEAD_SHA_BRANCH --head="HEAD" > $DIRECTORY/deps.txt
fi

LIST_SPECS="$(git diff --name-only $BRANCH_NAME HEAD)"

if [[ $LIST_SPECS == *"protractor.excludes.json"* ]]; then
  AFFECTED_LIBS="core$ content-services$ process-services$ process-services-cloud$ insights$ extensions$ testing$ cli$"
        echo "${AFFECTED_LIBS}"
        exit 0
fi

#cat $DIRECTORY/deps.txt
#echo "extensions" > deps.txt

#clean file
sed "${sedi[@]}" '/^$/d'  ./$DIRECTORY/deps.txt
sed "${sedi[@]}" '/alfresco-components/d' ./$DIRECTORY/deps.txt
sed "${sedi[@]}" '/nx affected:libs/d' ./$DIRECTORY/deps.txt
sed "${sedi[@]}" '/^$/d'  ./$DIRECTORY/deps.txt

#read result from file
while IFS= read -r var
do
    fileLine=$var
done < "./$DIRECTORY/deps.txt"

#transform string to array
libs=(`echo $fileLine | sed 's/^$/\n/g'`)

#extensions
for i in "${libs[@]}"
do
    if [ "$i" == "extensions" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" extensions$"
    fi
done

#core
for i in "${libs[@]}"
do
    if [ "$i" == "core" ] ; then
        AFFECTED_LIBS="core$ content-services$ process-services$ process-services-cloud$ insights$ extensions$ testing$ cli$"
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

#testing
for i in "${libs[@]}"
do
    if [ "$i" == "testing" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" testing$"
    fi
done

#process-services-cloud
for i in "${libs[@]}"
do
    if [ "$i" == "process-services-cloud" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" process-services-cloud$"
    fi
done

#cli
for i in "${libs[@]}"
do
    if [ "$i" == "cli" ] ; then
        AFFECTED_LIBS=$AFFECTED_LIBS" cli$"
    fi
done

echo "${AFFECTED_LIBS}"
