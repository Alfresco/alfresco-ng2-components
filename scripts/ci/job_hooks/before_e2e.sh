#!/usr/bin/env bash

# TODO: This one needs to be cleaned up... Only fixing it like this, because for the current PR it is out of scope
# =======================================
rm -rf ./node_modules/@alfresco/adf-cli/ && \
mkdir -p ./node_modules/@alfresco/adf-cli/ && \
cp -R ./lib/dist/cli/* ./node_modules/@alfresco/adf-cli/

rm -rf ./node_modules/@alfresco/adf-testing/ && \
mkdir -p ./node_modules/@alfresco/adf-testing/ && \
cp -R ./lib/dist/testing/* ./node_modules/@alfresco/adf-testing/
# =======================================

exit 0
