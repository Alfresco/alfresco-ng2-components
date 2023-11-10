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

import { ResultListDataRepresentationLightGroupRepresentation } from '../model/resultListDataRepresentationLightGroupRepresentation';
import { ResultListDataRepresentationLightUserRepresentation } from '../model/resultListDataRepresentationLightUserRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

export interface GetGroupsOpts {
    filter?: string;
    groupId?: number;
    externalId?: string;
    externalIdCaseInsensitive?: string;
    tenantId?: string;
}

/**
* Groups service.
* @module ActivitiGroupsApi
*/
export class ActivitiGroupsApi extends BaseApi {
    /**
    * Query groups
    *
    * @param opts Optional parameters
    * @return Promise<ResultListDataRepresentationLightGroupRepresentation>
    */
    getGroups(opts?: GetGroupsOpts): Promise<ResultListDataRepresentationLightGroupRepresentation> {
        return this.get({
            path: '/api/enterprise/groups',
            queryParams: opts,
            returnType: ResultListDataRepresentationLightGroupRepresentation
        });
    }

    /**
    * List members of a group
    *
    * @param groupId groupId
    * @return Promise<ResultListDataRepresentationLightUserRepresentation>
    */
    getUsersForGroup(groupId: number): Promise<ResultListDataRepresentationLightUserRepresentation> {
        throwIfNotDefined(groupId, 'formId');

        const pathParams = {
            groupId
        };

        return this.get({
            path: '/api/enterprise/groups/{groupId}/users',
            pathParams,
            returnType: ResultListDataRepresentationLightUserRepresentation
        });
    }
}
