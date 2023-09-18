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
        this.id = obj?.id || null;
        this.firstName = obj?.firstName;
        this.lastName = obj?.lastName;
        this.description = obj?.description || null;
        this.avatarId = obj?.avatarId || null;
        this.email = obj?.email || null;
        this.skypeId = obj?.skypeId;
        this.googleId = obj?.googleId;
        this.instantMessageId = obj?.instantMessageId;
        this.jobTitle = obj?.jobTitle || null;
        this.location = obj?.location || null;
        this.company = obj?.company;
        this.mobile = obj?.mobile;
        this.telephone = obj?.telephone;
        this.statusUpdatedAt = obj?.statusUpdatedAt;
        this.userStatus = obj?.userStatus;
        this.enabled = obj?.enabled;
        this.emailNotificationsEnabled = obj?.emailNotificationsEnabled;
        this.aspectNames = obj?.aspectNames;
        this.properties = obj?.properties;
        this.capabilities = obj?.capabilities;
    }

    isAdmin(): boolean {
        return this.capabilities?.isAdmin;
    }
}
