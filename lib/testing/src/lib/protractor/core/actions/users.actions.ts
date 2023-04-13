/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import * as path from 'path';
import * as fs from 'fs';

import { browser } from 'protractor';
import {
    UserProfileApi,
    AdminUsersApi,
    AdminTenantsApi,
    PeopleApi,
    ImageUploadRepresentation,
    UserRepresentation
} from '@alfresco/js-api';
import { IdentityService } from './identity/identity.service';
import { UserModel } from '../models/user.model';
import { ApiService } from '../../../shared/api/api.service';
import { Logger } from '../utils/logger';
import { Tenant } from '../models/tenant';

export class UsersActions {

    api: ApiService;
    identityService: IdentityService;
    peopleApi: PeopleApi;
    adminTenantsApi: AdminTenantsApi;
    adminUsersApi: AdminUsersApi;
    userProfileApi: UserProfileApi;

    constructor(apiService: ApiService) {
        this.api = apiService;
        this.peopleApi = new PeopleApi(apiService.getInstance());
        this.adminTenantsApi = new AdminTenantsApi(apiService.getInstance());
        this.adminUsersApi = new AdminUsersApi(apiService.getInstance());
        this.userProfileApi = new UserProfileApi(apiService.getInstance());
        if (this.api.apiService.isOauthConfiguration()) {
            this.identityService = new IdentityService(this.api);
        }
    }

    async createUser(userModel?: UserModel): Promise<UserModel> {
        if (!this.api.apiService.isLoggedIn()) {
            await this.api.apiService.login(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);
        }

        const user = new UserModel({ ...(userModel ? userModel : {}) });

        try {
            if (this.api.apiService.isEcmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
                Logger.log(`Create user ECM ${user.email}`);
                await this.peopleApi.createPerson({
                    id: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: user.password
                });
            }
        } catch (e) {
            if (e.status === 409) {
                Logger.error('ACS user already created');
            } else {
                Logger.error('Not able to create ACS user: ' + JSON.stringify(e));
            }
        }

        try {
            if (this.api.apiService.isBpmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
                Logger.log('Create user BPM');
                if (user.tenantId) {
                    const apsUser = await this.createApsUser(user.tenantId, user.email, user.firstName, user.lastName, user.password);
                    user.id = apsUser.id;
                } else {
                    const apsUser = await this.createTenantAndUser(user.email, user.firstName, user.lastName, user.password);
                    user.tenantId = apsUser.tenantId;
                    user.id = apsUser.id;
                }
            }
        } catch (e) {
            if (e.status === 409) {
                Logger.error('BPM user already created');
            } else {
                Logger.error('Not able to create BPM user: ' + JSON.stringify(e));
            }
        }

        try {
            if (this.api.apiService.isOauthConfiguration()) {
                Logger.log('Create user identity');

                const identityUser = await this.identityService.createIdentityUser(user);
                user.idIdentityService = identityUser.idIdentityService;
            }
        } catch (e) {
            if (e.status === 409) {
                Logger.error('Identity user already created');
            } else {
                Logger.error('Not able to create identity user: ' + JSON.stringify(e));
            }
        }

        return user;
    }

    async createUserWithName(firstName: string, lastName: string): Promise<UserModel> {
        const user = new UserModel({ firstName, lastName });
        return this.createUser(user);
    }

    async createTenantAndUser(email?: string, firstName?: string, lastName?: string, password?: string): Promise<UserRepresentation> {
        const newTenant = await this.adminTenantsApi.createTenant(new Tenant());

        const user = new UserModel({
            tenantId: newTenant.id,
            email,
            firstName,
            lastName,
            password
        });

        return this.adminUsersApi.createNewUser(user.getAPSModel());
    }

    async createApsUser(tenantId?: number, email?: string, firstName?: string, lastName?: string, password?: string): Promise<UserRepresentation> {

        const user = new UserModel({
            tenantId,
            email,
            firstName,
            lastName,
            password
        });

        return this.adminUsersApi.createNewUser(user.getAPSModel());
    }

    async changeProfilePictureAps(fileLocation: string): Promise<ImageUploadRepresentation> {
        const pathFile = path.join(browser.params.testConfig.main.rootPath + fileLocation);
        const file = fs.createReadStream(pathFile);

        return this.userProfileApi.uploadProfilePicture(file);
    }

    async deleteTenant(tenantId: number) {
        await this.adminTenantsApi.deleteTenant(tenantId);
    }
}
