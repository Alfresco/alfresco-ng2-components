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

import { ActivityPaging } from '../model/activityPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentPagingQuery } from './types';

/**
 * Activities service.
 * @module ActivitiesApi
 */
export class ActivitiesApi extends BaseApi {
    /**
     * List activities
     *
     * Gets a list of activities for person **personId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     *
     * @param personId The identifier of a person.
     * @param opts Optional parameters
     * @param opts.who A filter to include the user's activities only me, other user's activities only others'
     * @param opts.siteId Include only activity feed entries relating to this site.
     * @return Promise<ActivityPaging>
     */
    listActivitiesForPerson(
        personId: string,
        opts?: {
            who?: string;
            siteId?: string;
        } & ContentPagingQuery &
            ContentFieldsQuery
    ): Promise<ActivityPaging> {
        throwIfNotDefined(personId, 'personId');
        opts = opts || {};

        const pathParams = {
            personId
        };

        const queryParams = {
            ...opts,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/activities',
            pathParams,
            queryParams,
            returnType: ActivityPaging
        });
    }
}
