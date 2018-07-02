import Tenant = require('../models/APS/Tenant');
import User = require('../models/APS/User');
import TestConfig = require('../test.config');
import path = require('path');
import fs = require('fs');

export class UsersActions {

    async createTenantAndUser(alfrescoJsApi) {
        let newTenant = await alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        let user = new User({ tenantId: newTenant.id });

        await alfrescoJsApi.activiti.adminUsersApi.createNewUser(user);

        return user;
    }

    async createApsUser(alfrescoJsApi, tenantId) {
        let user = new User({ tenantId: tenantId });

        await alfrescoJsApi.activiti.adminUsersApi.createNewUser(user);

        return user;
    }

    async cleanupTenant(alfrescoJsApi, tenantId) {
        return alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
    }

    async changeProfilePictureAps(alfrescoJsApi, fileLocation) {
        let pathFile = path.join(TestConfig.main.rootPath + fileLocation);
        let file = fs.createReadStream(pathFile);

        return alfrescoJsApi.activiti.profileApi.uploadProfilePicture(file);
    }

}
