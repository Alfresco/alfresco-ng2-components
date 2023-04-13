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

import { Capabilities } from '@alfresco/js-api';
import { EcmCompanyModel } from './ecm-company.model';

export class EcmUserModel {
    id: string;
    firstName: string;
    lastName?: string;
    displayName?: string;
    description?: string;
    avatarId?: string;
    email: string;
    skypeId?: string;
    googleId?: string;
    instantMessageId?: string;
    jobTitle?: string;
    location?: string;
    company: EcmCompanyModel;
    mobile?: string;
    telephone?: string;
    statusUpdatedAt?: Date;
    userStatus?: string;
    enabled: boolean;
    emailNotificationsEnabled?: boolean;
    aspectNames?: string[];
    properties?: { [key: string]: string };
    capabilities?: Capabilities;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.firstName = obj && obj.firstName;
        this.lastName = obj && obj.lastName;
        this.description = obj && obj.description || null;
        this.avatarId = obj && obj.avatarId || null;
        this.email = obj && obj.email || null;
        this.skypeId = obj && obj.skypeId;
        this.googleId = obj && obj.googleId;
        this.instantMessageId = obj && obj.instantMessageId;
        this.jobTitle = obj && obj.jobTitle || null;
        this.location = obj && obj.location || null;
        this.company = obj && obj.company;
        this.mobile = obj && obj.mobile;
        this.telephone = obj && obj.telephone;
        this.statusUpdatedAt = obj && obj.statusUpdatedAt;
        this.userStatus = obj && obj.userStatus;
        this.enabled = obj && obj.enabled;
        this.emailNotificationsEnabled = obj && obj.emailNotificationsEnabled;
        this.aspectNames = obj && obj.aspectNames;
        this.properties = obj && obj.properties;
        this.capabilities = obj && obj.capabilities;
    }

    isAdmin(): boolean {
        return this.capabilities?.isAdmin;
    }
}
