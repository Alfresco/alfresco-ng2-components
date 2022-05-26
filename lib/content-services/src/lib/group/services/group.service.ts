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

import { Injectable } from '@angular/core';
import { GroupEntry } from '@alfresco/js-api';
import { ApiClientsService } from '@alfresco/adf-core/api';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    get groupsApi() {
        return this.apiClientsService.get('ContentClient.groups');
    }

    constructor(private apiClientsService: ApiClientsService) {}

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
