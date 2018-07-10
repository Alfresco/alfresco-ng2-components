import TestConfig = require('../../test.config');
import AppPublish = require('../../models/APS/AppPublish');

export class ModelsActions {

    async deleteVersionModel(alfrescoJsApi, modelId) {

        let versionModelDeleted = await alfrescoJsApi.activiti.modelsApi.deleteModel(modelId, { cascade: false, deleteRuntimeApp : true });

        return versionModelDeleted;
    }

    async deleteEntireModel(alfrescoJsApi, modelId) {

        let modelDeleted = await alfrescoJsApi.activiti.modelsApi.deleteModel(modelId, { cascade: true, deleteRuntimeApp : true });

        return modelDeleted;
    }

}
