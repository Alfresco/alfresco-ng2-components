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

import { StringUtil } from '../../../shared/utils/string.util';
import { browser } from 'protractor';
import { UserRepresentation } from '@alfresco/js-api';

export class UserModel {

    firstName?: string = StringUtil.generateRandomLowercaseString();
    lastName?: string = StringUtil.generateRandomLowercaseString();
    password?: string = StringUtil.generateRandomLowercaseString(4) + StringUtil.generateRandomString(4).toUpperCase();
    email?: string;
    username?: string;
    idIdentityService?: string;
    type = 'enterprise';
    tenantId?: number;
    company?: string;
    id: number;

    constructor(details: any = {}) {
        const EMAIL_DOMAIN = browser.params?.testConfig?.emailDomain ? browser.params.testConfig.emailDomain : 'example.com';
        this.firstName = details.firstName ? details.firstName : this.firstName;
        this.lastName = details.lastName ? details.lastName : this.lastName;

        const USER_IDENTIFY = `${this.firstName}${this.lastName}.${StringUtil.generateRandomLowercaseString(5)}`;

        this.password = details.password ? details.password : this.password;
        this.email = details.email ? details.email : `${USER_IDENTIFY}@${EMAIL_DOMAIN}`;
        this.username = details.username ? details.username : USER_IDENTIFY;
        this.idIdentityService = details.idIdentityService ? details.idIdentityService : this.idIdentityService;
        this.type = details.type ? details.type : this.type;
        this.tenantId = details.tenantId ? details.tenantId : this.tenantId;
        this.company = details.company ? details.company : this.company;
        this.id = details.id ? details.id : this.id;
    }

    get fullName() {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
    }

    getAPSModel() {
        return new UserRepresentation({
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            email: this.email,
            type: this.type,
            tenantId: this.tenantId,
            company: this.company,
            id: this.id
        });
    }

}
