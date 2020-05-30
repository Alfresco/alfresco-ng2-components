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

import { StringUtil } from '@alfresco/adf-testing';

/**
 * Create tenant JSON Object
 *
 * @param details - JSON object used to overwrite the default values
 * @constructor
 */
export class ApsUserModel {

    email = StringUtil.generateRandomEmail('@activiti.test.com');
    firstName = StringUtil.generateRandomString();
    lastName = StringUtil.generateRandomString();
    password = StringUtil.generatePasswordString();
    type = 'enterprise';
    tenantId = 1;
    company = null;
    id = 0;

    constructor(details: any = {}) {
        this.email = details.email ? details.email : StringUtil.generateRandomEmail('@activiti.test.com');
        this.firstName = details.firstName ? details.firstName : StringUtil.generateRandomString();
        this.lastName = details.lastName ? details.lastName : StringUtil.generateRandomString();
        this.password = details.password ? details.password : StringUtil.generateRandomString();
        this.type = details.type ? details.type : 'enterprise';
        this.tenantId = details.tenantId ? details.tenantId : 1;
        this.company = details.company ? details.company : null;
        this.id = details.id ? details.id : 0;
    }
}
