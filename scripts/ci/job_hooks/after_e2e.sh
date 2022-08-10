#!/usr/bin/env bash

# Upload protractor-smartrunner artifact related to this particular job to S3
dbpci-artifact-to-s3 -a "$SMART_RUNNER_DIRECTORY" -o "$S3_SMART_RUNNER_PATH/$TRAVIS_JOB_ID.tar.bz2"

