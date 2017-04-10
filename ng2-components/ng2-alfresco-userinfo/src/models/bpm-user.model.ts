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

export class BpmUserModel {
    apps: any;
    capabilities: string;
    company: string;
    created: string;
    email: string;
    externalId: string;
    firstName: string;
    lastName: string;
    fullname: string;
    groups: any;
    id: string;
    lastUpdate: string;
    latestSyncTimeStamp: string;
    password: string;
    pictureId: string;
    status: string;
    tenantId: string;
    tenantName: string;
    tenantPictureId: string;
    type: string;

    constructor(obj?: any) {
        this.apps = obj && obj.apps || null;
        this.capabilities = obj && obj.capabilities || false;
        this.company = obj && obj.company || null;
        this.created = obj && obj.created || null;
        this.email = obj && obj.email || null;
        this.externalId = obj && obj.externalId || null;
        this.firstName = obj && obj.firstName;
        this.lastName = obj && obj.lastName;
        this.fullname = obj && obj.fullname;
        this.groups = obj && obj.groups || null;
        this.id = obj && obj.id || null;
        this.lastUpdate = obj && obj.lastUpdate;
        this.latestSyncTimeStamp = obj && obj.latestSyncTimeStamp;
        this.password = obj && obj.password;
        this.pictureId = obj && obj.pictureId;
        this.status = obj && obj.status;
        this.tenantId = obj && obj.tenantId;
        this.tenantName = obj && obj.tenantName;
        this.tenantPictureId = obj && obj.tenantPictureId;
        this.type = obj && obj.type;
    }
}
