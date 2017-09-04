#!/usr/bin/env bash

ADF_VERSION=$(npm view ng2-alfresco-core@beta version)
BETA_VERSION=( ${ADF_VERSION//-/ } )

echo ${BETA_VERSION[0]}
