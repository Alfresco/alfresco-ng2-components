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
import { PersonEntry } from '@alfresco/js-api/src/api/content-rest-api/model/personEntry';
import { ImageUploadRepresentation } from '@alfresco/js-api/src/api/activiti-rest-api/model/imageUploadRepresentation';
import { Person } from '@alfresco/js-api/src/api/content-rest-api/model/person';
import { UserRepresentation } from '@alfresco/js-api';
import { ApiService, IdentityService } from '@alfresco/adf-testing';

export class UsersActions {

    api: ApiService;
    identityService: IdentityService;

    constructor(alfrescoApi: ApiService) {
        this.api = alfrescoApi;
        this.identityService = new IdentityService(this.api);
    }

    async createUser(email?: string, firstName?: string, lastName?: string, tenantId?: number): Promise<{ apsUser: UserRepresentation, acsUser: Person }> {
        let apsUser: UserRepresentation;
        let acsUser: PersonEntry;

        if (this.api.apiService.isEcmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
            acsUser = await this.createAcsUser(email, firstName, lastName);
        }

        if (this.api.apiService.isBpmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
            if (tenantId) {
                apsUser = await this.createApsUser(tenantId, email, firstName, lastName);
            } else {
                apsUser = await this.createTenantAndUser(email, firstName, lastName);
            }
        }

        if (this.api.apiService.isOauthConfiguration()) {

        }

        return { apsUser: apsUser, acsUser: acsUser.entry };
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
