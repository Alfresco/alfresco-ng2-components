#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Update Generator"
./scripts/travis/update/update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/generator-ng2-alfresco-app'
echo "Update ACA"
./scripts/travis/update/update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/alfresco-content-app'
echo "Update ADF"
./scripts/travis/update/update-project.sh -gnu -t $GITHUB_TOKEN -n 'Alfresco/alfresco-ng2-components'
echo "Update AMA"
./scripts/travis/update/update-project.sh -gnu -t $GITHUB_ENTERPRISE_TOKEN -n 'Alfresco/alfresco-modeler-app'
echo "Update Workspace"
./scripts/travis/update/update-project.sh -gnu -t $GITHUB_ENTERPRISE_TOKEN -n 'Alfresco/alfresco-process-workspace-app'
echo "Update APA Activiti"
./scripts/travis/update/update-project.sh -gnu -t $GITHUB_ENTERPRISE_TOKEN -n 'Alfresco/alfresco-admin-app'
