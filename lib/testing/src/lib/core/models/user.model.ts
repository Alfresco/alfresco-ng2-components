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

import { StringUtil } from '../utils/string.util';
import { browser } from 'protractor';

export class UserModel {

    firstName?: string = StringUtil.generateRandomString();
    lastName?: string = StringUtil.generateRandomString();
    password?: string = StringUtil.generateRandomString();
    email?: string;
    username?: string;
    idIdentityService?: string;
    type = 'enterprise';
    tenantId = 1;
    company = null;
    id: number;

    constructor(details: any = {}) {
        const EMAIL_DOMAIN = browser.params.testConfig ? browser.params.testConfig.projectName : 'alfresco';
        const USER_IDENTIFY = StringUtil.generateRandomString();

        this.firstName = details.firstName ? details.firstName : this.firstName;
        this.lastName = details.lastName ? details.lastName : this.lastName;
        this.password = details.password ? details.password : this.password;
        this.email = details.email ? details.email : `${USER_IDENTIFY}@${EMAIL_DOMAIN}.com`;
        this.username = details.username ? details.username : USER_IDENTIFY.toLowerCase();
        this.idIdentityService = details.idIdentityService ? details.idIdentityService : this.idIdentityService;
        this.type = details.type ? details.type : this.type;
        this.tenantId = details.tenantId ? details.tenantId : this.tenantId;
        this.company = details.company ? details.company : this.company;
        this.id = details.id ? details.id : this.id;
    }

}
