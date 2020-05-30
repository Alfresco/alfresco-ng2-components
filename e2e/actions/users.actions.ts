/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import path = require('path');
import fs = require('fs');
import remote = require('selenium-webdriver/remote');
import { browser } from 'protractor';
import { AcsUserModel } from '../models/ACS/acs-user.model';
import { ApsUserModel } from '../models/APS/aps-user.model';
import { PersonEntry, ImageUploadRepresentation, UserRepresentation } from '@alfresco/js-api';
import { ApiService, IdentityService, UserModel } from '@alfresco/adf-testing';

export class UsersActions {

    api: ApiService;
    identityService: IdentityService;

    constructor(alfrescoApi: ApiService) {
        this.api = alfrescoApi;
        if (this.api.apiService.isOauthConfiguration()) {
            this.identityService = new IdentityService(this.api);
        }
    }

    async createUser(email?: string, firstName?: string, lastName?: string, tenantId?: number): Promise<UserModel> {
        const user = new UserModel({ email, firstName, lastName, tenantId });

        if (this.api.apiService.isEcmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
            await this.createAcsUser(user.email, user.firstName, user.lastName);
        }

        if (this.api.apiService.isBpmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
            if (tenantId) {
                await this.createApsUser(user.tenantId, user.email, user.firstName, user.lastName);
            } else {
                await this.createTenantAndUser(user.email, user.firstName, user.lastName);
            }
        }

        if (this.api.apiService.isOauthConfiguration()) {
            await this.identityService.createIdentityUser();
        }

        return user;
    }

    async createAcsUser(email?: string, firstName?: string, lastName?: string): Promise<PersonEntry> {
        const acsUser = new AcsUserModel({ email, firstName, lastName });
        return this.api.apiService.core.peopleApi.addPerson(acsUser);
    }

    async createTenantAndUser(email?: string, firstName?: string, lastName?: string): Promise<UserRepresentation> {
        const newTenant = await this.api.apiService.activiti.adminTenantsApi.createTenant(new Tenant());

        const user = new ApsUserModel({ tenantId: newTenant.id, email, firstName, lastName });

        return this.api.apiService.activiti.adminUsersApi.createNewUser(user);
    }

    async createApsUser(tenantId?: number, email?: string, firstName?: string, lastName?: string): Promise<UserRepresentation> {
        const user = new ApsUserModel({ tenantId, email, firstName, lastName });

        return this.api.apiService.activiti.adminUsersApi.createNewUser(user);
    }

    async changeProfilePictureAps(fileLocation): Promise<ImageUploadRepresentation> {
        browser.setFileDetector(new remote.FileDetector());

        const pathFile = path.join(browser.params.testConfig.main.rootPath + fileLocation);
        const file = fs.createReadStream(pathFile);

        return this.api.apiService.activiti.profileApi.uploadProfilePicture(file);
    }

}
