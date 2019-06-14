#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../

echo "Update Generator"
./update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/generator-ng2-alfresco-app'
echo "Update ACA"
./update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/alfresco-content-app'
echo "Update ADW"
./update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/adf-app-manager-ui'
echo "Update ADF"
./update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/alfresco-ng2-components'
echo "Update AMA"
./update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/alfresco-modeler-app'
echo "Update AMA Activiti"
./update-project.sh -gnu -t $GITHUB_TOKEN -n 'Activiti/activiti-modeling-app'
echo "Update APA Activiti"
./update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/alfresco-admin-app'
