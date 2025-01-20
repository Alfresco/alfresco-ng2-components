/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { PreferenceEntry, PreferencePaging } from '../model';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';
import { ContentFieldsQuery, ContentPagingQuery } from './types';

/**
 * Preferences service.
 */
export class PreferencesApi extends BaseApi {
    /**
     * Get a preference
     *
     * Gets a specific preference for person **personId**.
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     * @param personId The identifier of a person.
     * @param preferenceName The name of the preference.
     * @param opts Optional parameters
     * @returns Promise<PreferenceEntry>
     */
    getPreference(personId: string, preferenceName: string, opts?: ContentFieldsQuery): Promise<PreferenceEntry> {
        throwIfNotDefined(personId, 'personId');
        throwIfNotDefined(preferenceName, 'preferenceName');

        const pathParams = {
            personId,
            preferenceName
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/preferences/{preferenceName}',
            pathParams,
            queryParams
        });
    }

    /**
     * List preferences
     *
     * You can use the -me- string in place of <personId> to specify the currently authenticated user.
     * Note that each preference consists of an **id** and a **value**.
     *
     * The **value** can be of any JSON type.
     * @param personId The identifier of a person.
     * @param opts Optional parameters
     * @returns Promise<PreferencePaging>
     */
    listPreferences(personId: string, opts?: ContentPagingQuery & ContentFieldsQuery): Promise<PreferencePaging> {
        throwIfNotDefined(personId, 'personId');

        const pathParams = {
            personId
        };

        const queryParams = {
            ...(opts || {}),
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/people/{personId}/preferences',
            pathParams,
            queryParams
        });
    }
}
