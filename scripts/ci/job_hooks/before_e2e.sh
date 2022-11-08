#!/usr/bin/env bash

 # Download protractor-smartrunner artifact related to this particular job from S3, if exists
./scripts/ci/utils/artifact-from-s3.sh -a "$S3_SMART_RUNNER_PATH/$TRAVIS_JOB_ID.tar.bz2" -o "$SMART_RUNNER_DIRECTORY"

# The adf-testing is not installed through NPM for this reason it needs to be built
#   in addition the dist folder needs to be moved as part of the node modules
#   in this way the protractor.config.js can use require('@alfresco/adf-testing');
nx run testing:bundle

exit 0
