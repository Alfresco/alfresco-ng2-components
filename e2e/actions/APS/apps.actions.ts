import path = require('path');
import fs = require('fs');
import TestConfig = require('../../test.config');
import AppPublish = require('../../models/APS/AppPublish');

export class AppsActions {

    async importPublishDeployApp(alfrescoJsApi, appFileLocation) {

        let pathFile = path.join(TestConfig.main.rootPath + appFileLocation);
        let file = fs.createReadStream(pathFile);

        let appCreated = await alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        let publishApp = await alfrescoJsApi.activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish());

        let published = await alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return appCreated;
    }

    async startProcess(alfrescoJsApi, app, processName) {

        let appDefinitionsList = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();

        let appDefinition = appDefinitionsList.data.filter((currentApp) => {
            return currentApp.name === app.name;
        });

        let processDefinitionList = await alfrescoJsApi.activiti.processApi.getProcessDefinitions({ deploymentId: appDefinition.deploymentId });

        let startProcessOptions = { processDefinitionId: processDefinitionList.data[0].id };

        if (typeof processName !== 'undefined') {
            startProcessOptions.name = processName;
        }

        return await alfrescoJsApi.activiti.processApi.startNewProcessInstance(startProcessOptions);

    }

}
