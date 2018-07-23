import TestConfig = require('../../test.config');
import AppPublish = require('../../models/APS/AppPublish');

export class ModelsActions {

    async deleteVersionModel(alfrescoJsApi, modelId) {

       return await alfrescoJsApi.activiti.modelsApi.deleteModel(modelId, { cascade: false, deleteRuntimeApp : true });
    }

    async deleteEntireModel(alfrescoJsApi, modelId) {

        return await alfrescoJsApi.activiti.modelsApi.deleteModel(modelId, { cascade: true, deleteRuntimeApp : true });
    }

}
