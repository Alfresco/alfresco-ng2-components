#!/bin/sh -f

# Trigger a new Travis-CI job.

# Usage:
#   trigger-travis.sh [--pro] [--branch BRANCH] GITHUBID GITHUBPROJECT TRAVIS_ACCESS_TOKEN [MESSAGE]
# For example:
#   trigger-travis.sh typetools checker-framework `cat ~/private/.travis-access-token` "Trigger for testing"

# For full documentation, see
# https://github.com/plume-lib/trigger-travis/


eval repos=( "alfresco-modeler-app"
    "alfresco-process-workspace-app"
    "alfresco-admin-app")

if [ "$#" -lt 3 ] || [ "$#" -ge 7 ]; then
  echo "Wrong number of arguments $# to trigger-travis.sh; run like:"
  echo " trigger-travis.sh [--branch BRANCH]  GITHUBPROJECT TRAVIS_ACCESS_TOKEN [MESSAGE]" >&2
  exit 1
fi

if [ "$1" = "--branch" ] ; then
  shift
  BRANCH="$1"
  shift
else
  BRANCH=master
fi

USER=$1
TOKEN=$2
if [ $# -eq 4 ] ; then
    MESSAGE=",\"message\": \"$4\""
elif [ -n "$TRAVIS_REPO_SLUG" ] ; then
    MESSAGE=",\"message\": \"Triggered by upstream build of $TRAVIS_REPO_SLUG commit "`git log --oneline -n 1 HEAD`"\""
else
    MESSAGE=""
fi
## For debugging:
# echo "USER=$USER"
# echo "REPO=$REPO"
# echo "TOKEN=$TOKEN"
# echo "MESSAGE=$MESSAGE"

body="{
\"request\": {
  \"branch\":\"$BRANCH\"
  $MESSAGE
}}"


for REPO in ${repos[@]}
do

    # "%2F" creates a literal "/" in the URL, that is not interpreted as a
    # segment or directory separator.
    curl -s -X POST \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -H "Travis-API-Version: 3" \
      -H "Authorization: token ${TOKEN}" \
      -d "$body" \
      https://api.travis-ci.com/repo/${USER}%2F${REPO}/requests \
     | tee /tmp/travis-request-output.$$.txt

    if grep -q '"@type": "error"' /tmp/travis-request-output.$$.txt; then
        exit 1
    fi
    if grep -q 'access denied' /tmp/travis-request-output.$$.txt; then
        exit 1
    fi

fi
