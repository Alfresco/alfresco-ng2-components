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

import path = require('path');
import fs = require('fs');
import remote = require('selenium-webdriver/remote');

import { browser } from 'protractor';

import { ImageUploadRepresentation, UserRepresentation } from '@alfresco/js-api';
import { ApiService, IdentityService, UserModel, Logger } from '@alfresco/adf-testing';
import { Tenant } from '../models/APS/tenant';

export class UsersActions {

    api: ApiService;
    identityService: IdentityService;

    constructor(alfrescoApi: ApiService) {
        this.api = alfrescoApi;
        if (this.api.apiService.isOauthConfiguration()) {
            this.identityService = new IdentityService(this.api);
        }
    }

    async createUser(emailOrUserModel?: string | UserModel, firstName?: string, lastName?: string, tenantId?: number, password?: string): Promise<UserModel> {

        let user;

        if (typeof emailOrUserModel !== 'string') {
            user = new UserModel(emailOrUserModel);
        } else {
            user = new UserModel({ emailOrUserModel, firstName, lastName, tenantId, password });
        }

        if (this.api.apiService.isEcmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
            Logger.log('Create user ECM');
            await this.api.apiService.core.peopleApi.addPerson({
                id: user.email,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password
            });
        }

        if (this.api.apiService.isBpmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
            Logger.log('Create user BPM');

            try {
                if (tenantId) {
                    await this.createApsUser(user.tenantId, user.email, user.firstName, user.lastName, user.password);
                } else {
                    const apsUserTenant = await this.createTenantAndUser(user.email, user.firstName, user.lastName, user.password);
                    user.tenantId = apsUserTenant.tenantId;
                }
            } catch (e) {}
        }

        if (this.api.apiService.isOauthConfiguration()) {
            Logger.log('Create user identity');

            const identityUser = await this.identityService.createIdentityUser(user);
            user.idIdentityService = identityUser.idIdentityService;
        }

        return user;
    }

    async createTenantAndUser(email?: string, firstName?: string, lastName?: string, password?: string): Promise<UserRepresentation> {
        const newTenant = await this.api.apiService.activiti.adminTenantsApi.createTenant(new Tenant());

        return this.api.apiService.activiti.adminUsersApi.createNewUser(new UserRepresentation({
            tenantId: newTenant.id,
            email,
            firstName,
            lastName,
            password
        }));
    }

    async createApsUser(tenantId?: number, email?: string, firstName?: string, lastName?: string, password?: string): Promise<UserRepresentation> {
        return this.api.apiService.activiti.adminUsersApi.createNewUser(new UserRepresentation({
            tenantId,
            email,
            firstName,
            lastName,
            password
        }));
    }

    async changeProfilePictureAps(fileLocation: string): Promise<ImageUploadRepresentation> {
        browser.setFileDetector(new remote.FileDetector());

        const pathFile = path.join(browser.params.testConfig.main.rootPath + fileLocation);
        const file = fs.createReadStream(pathFile);

        return this.api.apiService.activiti.profileApi.uploadProfilePicture(file);
    }
}
