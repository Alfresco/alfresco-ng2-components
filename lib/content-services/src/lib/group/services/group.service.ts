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

import { Injectable } from '@angular/core';
import { GroupEntry, GroupsApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    private _groupsApi: GroupsApi;
    get groupsApi(): GroupsApi {
        this._groupsApi = this._groupsApi ?? new GroupsApi(this.alfrescoApiService.getInstance());
        return this._groupsApi;
    }

    constructor(
        private alfrescoApiService: AlfrescoApiService
    ) {
    }

    async listAllGroupMembershipsForPerson(personId: string, opts?: any, accumulator = []): Promise<GroupEntry[]> {
        const groupsPaginated = await this.groupsApi.listGroupMembershipsForPerson(personId, opts);
        accumulator = [...accumulator, ...groupsPaginated.list.entries];
        if (groupsPaginated.list.pagination.hasMoreItems) {
            const skip = groupsPaginated.list.pagination.skipCount + groupsPaginated.list.pagination.count;
            return this.listAllGroupMembershipsForPerson(personId, {
                maxItems: opts.maxItems,
                skipCount: skip
            }, accumulator);
        } else {
            return accumulator;
        }
    }
}
