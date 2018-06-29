import path = require('path');
import fs = require('fs');
import TestConfig = require('../../test.config.js');
import AppPublish = require('../../models/APS/AppPublish');

export class AppsActions {

    async importPublishDeployApp(alfrescoJsApi, appFileLocation) {

        let pathFile = path.join(TestConfig.main.rootPath + appFileLocation);
        let file = fs.createReadStream(pathFile);

        let appCreated = await alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        let publishApp = await alfrescoJsApi.activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish());

        await alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        return appCreated;
    }

}
