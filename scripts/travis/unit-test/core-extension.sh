#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

ng test core --watch=false && \
ng test extensions --watch=false


# AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";

# echo "================== core unit ==================="

# if [[ $AFFECTED_LIBS =~ "core$" || $TRAVIS_PULL_REQUEST == "false" ]];
# then
#     ng test core --watch=false || exit 1;
# fi;

# echo "================== extensions unit ==================="

# if [[ $AFFECTED_LIBS =~ "extensions$" || $TRAVIS_PULL_REQUEST == "false"  ]];
# then
#     ng test extensions --watch=false || exit 1;
# fi;

# bash <(curl -s https://codecov.io/bash) -X gcov
