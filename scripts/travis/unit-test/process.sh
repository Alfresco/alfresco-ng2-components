#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

command="concurrently "

cd $DIR/../../../

ng test process-services --watch=false && \
ng test insights --watch=false && \
ng test process-services-cloud --watch=false

# AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";

# echo "================== process-services unit ==================="
# if [[ $AFFECTED_LIBS =~ "process-services$" || $TRAVIS_PULL_REQUEST == "false"  ]];
# then
#     ng test process-services --watch=false || exit 1;
# fi;

# echo "================== insights unit ==================="
# if [[ $AFFECTED_LIBS =~ "insights$" || $TRAVIS_PULL_REQUEST == "false"  ]];
# then
#     ng test insights --watch=false || exit 1;
# fi;

# echo "================== process-services-cloud unit ==================="
# if [[ $AFFECTED_LIBS =~ "process-services-cloud$" || $TRAVIS_PULL_REQUEST == "false"  ]];
# then
#     ng test process-services-cloud --watch=false || exit 1;
# fi;

# bash <(curl -s https://codecov.io/bash) -X gcov
