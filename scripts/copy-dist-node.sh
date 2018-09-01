#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../

echo "====== COPY new build in node_modules ===== "

rm -rf ../node_modules/@alfresco

mkdir -p $DIR/../node_modules/@alfresco/adf-core
mkdir -p $DIR/../node_modules/@alfresco/adf-content-services
mkdir -p $DIR/../node_modules/@alfresco/adf-process-services
mkdir -p $DIR/../node_modules/@alfresco/adf-insights

cp -R $DIR/../lib/dist/core/* $DIR/../node_modules/@alfresco/adf-core
cp -R $DIR/../lib/dist/content-services/* $DIR/../node_modules/@alfresco/adf-content-services
cp -R $DIR/../lib/dist/process-services/* $DIR/../node_modules/@alfresco/adf-process-services
cp -R $DIR/../lib/dist/insights/* $DIR/../node_modules/@alfresco/adf-insights
