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

import { Pagination } from '@alfresco/js-api';

export class IdentityGroupModel {

    id: string;
    name: string;
    path: string;
    realmRoles: string[];
    clientRoles: any;
    access: any;
    attributes: any;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || null;
            this.name = obj.name || null;
            this.path = obj.path || null;
            this.realmRoles = obj.realmRoles || null;
            this.clientRoles = obj.clientRoles || null;
            this.access = obj.access || null;
            this.attributes = obj.attributes || null;
        }
    }
}

export interface IdentityGroupSearchParam {
    name?: string;
}

export interface IdentityGroupQueryResponse {

    entries: IdentityGroupModel[];
    pagination: Pagination;
}

export class IdentityGroupQueryCloudRequestModel {

    first: number;
    max: number;

    constructor(obj?: any) {
        if (obj) {
            this.first = obj.first;
            this.max = obj.max;
        }
    }
}

export interface IdentityGroupCountModel {
    count: number;
}
