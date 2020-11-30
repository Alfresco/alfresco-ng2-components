#!/usr/bin/env bash

set -e

[[ "$BUILD_ENABLED" == "true" ]] && $(dirname $0)/build.sh

env \
  PROJECT_NAME=demo-shell \
  BASE_PATH=${BASE_PATH:-/adf} \
  DOCKER_IMAGE_REPO=alfresco/demo-shell \
  $(dirname $0)/run.sh
