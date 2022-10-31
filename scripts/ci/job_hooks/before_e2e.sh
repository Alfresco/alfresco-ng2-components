#!/usr/bin/env bash

 # Download protractor-smartrunner artifact related to this particular job from S3, if exists
./scripts/ci/utils/artifact-from-s3.sh -a "$S3_SMART_RUNNER_PATH/$TRAVIS_JOB_ID.tar.bz2" -o "$SMART_RUNNER_DIRECTORY"

# TODO: This one needs to be cleaned up... Only fixing it like this, because for the current PR it is out of scope
# =======================================
nx run cli:copydist
nx run testing:copydist
# =======================================

exit 0
