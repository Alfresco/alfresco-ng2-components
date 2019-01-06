/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Tenant } from '../models/APS/tenant';
import { User } from '../models/APS/user';
import TestConfig = require('../test.config');
import path = require('path');
import fs = require('fs');
import remote = require('selenium-webdriver/remote');
import { browser } from 'protractor';

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

    async getApsUserByEmail(alfrescoJsApi, email) {

        let users = await alfrescoJsApi.activiti.adminUsersApi.getUsers();

        let user = users.data.filter((currentUser) => {
            return currentUser.email === email;
        });

        return user;
    }

    async createApsUserWithName(alfrescoJsApi, tenantId, email, firstName, lastName) {
        let user = new User({ tenantId: tenantId , email: email, firstName: firstName, lastName: lastName});

        await alfrescoJsApi.activiti.adminUsersApi.createNewUser(user);

        return user;
    }

    async cleanupTenant(alfrescoJsApi, tenantId) {
        return alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
    }

    async changeProfilePictureAps(alfrescoJsApi, fileLocation) {
        browser.setFileDetector(new remote.FileDetector());

        let pathFile = path.join(TestConfig.main.rootPath + fileLocation);
        let file = fs.createReadStream(pathFile);

        return alfrescoJsApi.activiti.profileApi.uploadProfilePicture(file);
    }

}
