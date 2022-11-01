#!/usr/bin/env bash

npm ci
# the cli/testing need to be always build because they are now installed from NPM!
# nx build cli
# nx build testing
# The adf-cli is not installed through NPM for this reason it needs to be built
#   in addition the dist folder needs to be moved as part of the node modules
#   in this way every check like check-cs check-ps can use the adf cli
#   the bundle is saved under node_modules also to use the same cache of travis
nx run cli:bundle
# The adf-testing is not installed through NPM for this reason it needs to be built
#   in addition the dist folder needs to be moved as part of the node modules
#   in this way the protractor.config.js can use require('@alfresco/adf-testing');
nx run testing:bundle
