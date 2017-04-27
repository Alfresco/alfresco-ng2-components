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

// re-export for tester convenience
export { BpmUserModel } from '../models/bpm-user.model';
export { BpmUserService } from '../services/bpm-user.service';

export var fakeBpmUserNoImage = {
    apps: [],
    capabilities: 'fake-capability',
    company: 'fake-company',
    created: 'fake-create-date',
    email: 'fakeBpm@fake.com',
    externalId: 'fake-external-id',
    firstName: 'fake-first-name',
    lastName: 'fake-last-name',
    fullname: 'fake-full-name',
    groups: [],
    id: 'fake-id',
    lastUpdate: 'fake-update-date',
    latestSyncTimeStamp: 'fake-timestamp',
    password: 'fake-password',
    pictureId: undefined,
    status: 'fake-status',
    tenantId: 'fake-tenant-id',
    tenantName: 'fake-tenant-name',
    tenantPictureId: 'fake-tenant-picture-id',
    type: 'fake-type'
};

export var fakeBpmUser = {
    apps: [],
    capabilities: null,
    company: 'fake-company',
    created: 'fake-create-date',
    email: 'fakeBpm@fake.com',
    externalId: 'fake-external-id',
    firstName: 'fake-bpm-first-name',
    lastName: 'fake-bpm-last-name',
    fullname: 'fake-bpm-full-name',
    groups: [],
    id: 'fake-id',
    lastUpdate: 'fake-update-date',
    latestSyncTimeStamp: 'fake-timestamp',
    password: 'fake-password',
    pictureId: 'src/assets/bpmImg.gif',
    status: 'fake-status',
    tenantId: 'fake-tenant-id',
    tenantName: 'fake-tenant-name',
    tenantPictureId: 'fake-tenant-picture-id',
    type: 'fake-type'
};

export var fakeBpmEditedUser = {
    apps: [],
    capabilities: 'fake-capability',
    company: 'fake-company',
    created: 'fake-create-date',
    email: 'fakeBpm@fake.com',
    externalId: 'fake-external-id',
    firstName: 'fake-first-name',
    lastName: 'fake-last-name',
    fullname: 'fake-full-name',
    groups: [],
    id: 'fake-id',
    lastUpdate: 'fake-update-date',
    latestSyncTimeStamp: 'fake-timestamp',
    password: 'fake-password',
    pictureId: 'src/assets/images/bpmImg.gif',
    status: 'fake-status',
    tenantId: 'fake-tenant-id',
    tenantName: 'fake-tenant-name',
    tenantPictureId: 'fake-tenant-picture-id',
    type: 'fake-type'
};
