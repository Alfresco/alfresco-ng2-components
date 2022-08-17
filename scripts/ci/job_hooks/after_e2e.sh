#!/usr/bin/env bash

# Upload protractor-smartrunner artifact related to this particular job to S3
./scripts/ci/utils/artifact-to-s3.sh -a "$SMART_RUNNER_DIRECTORY" -o "$S3_SMART_RUNNER_PATH/$TRAVIS_JOB_ID.tar.bz2"

