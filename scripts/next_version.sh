#!/usr/bin/env bash

ADF_VERSION=$(npm view ng2-alfresco-core version)
NEXT_VERSION=( ${ADF_VERSION//./ } )
((NEXT_VERSION[1]++))
NEXT_VERSION[2]=0
NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"

echo $NEXT_VERSION
