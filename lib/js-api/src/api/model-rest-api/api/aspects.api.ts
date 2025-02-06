/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AspectEntry } from '../model/aspectEntry';
import { AspectPaging } from '../model/aspectPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';

export class ListAspectsOpts {
    /**
     * Optionally filter the list. Here are some examples:
     *
     * An aspect should be represented in the following format(prefix:name). e.g 'cm:title'.
     *
     * The following where clause will only return aspects from the namespace1:model and namespace2:model.
     *
     *   - where=(modelId in ('namespace1:model','namespace2:model'))
     *   - where=(modelId in ('namespace1:model INCLUDESUBASPECTS','namespace2:model'))
     *
     * The following where clause will only return sub aspects for the given parents.
     *
     *   - where=(parentId in ('namespace1:parent','namespace2:parent'))
     *
     * The following where clause will only return aspects that match the pattern.
     *
     *   - where=(namespaceUri matches('http://www.alfresco.*'))
     *
     * The following where clause will only return aspects that don't match the pattern.
     *
     *   - where=(not namespaceUri matches('http://www.alfresco.*'))
     */
    where?: string;
    // The number of entities that exist in the collection before those included in this list.
    // If not supplied then the default value is 0.
    skipCount?: number;
    // The maximum number of items to return in the list.
    // If not supplied then the default value is 100.
    maxItems?: number;
    /**
     * Returns additional information about the aspect. The following optional fields can be requested:
     * - properties
     * - mandatoryAspects
     * - associations
     */
    include?: string[];
}

/**
 * Aspects service.
 */
export class AspectsApi extends BaseApi {
    /**
     * Get an aspect
     *
     * **Note:** This is available in Alfresco 7.0.0 and newer versions.
     * @param aspectId The `Qname` of an aspect(prefix:name) e.g 'cm:title'
     * @returns Promise<AspectEntry>
     */
    getAspect(aspectId: string): Promise<AspectEntry> {
        throwIfNotDefined(aspectId, 'aspectId');

        const pathParams = {
            aspectId
        };

        return this.get<AspectEntry>({
            path: '/aspects/{aspectId}',
            pathParams,
            returnType: AspectEntry
        });
    }

    /**
     * List aspects
     *
     * **Note:** This is available in Alfresco 7.0.0 and newer versions.
     * @param opts Optional parameters
     * @returns Promise<AspectPaging>
     */
    listAspects(opts?: ListAspectsOpts): Promise<AspectPaging> {
        const queryParams = {
            where: opts?.where,
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            include: buildCollectionParam(opts?.include, 'csv')
        };

        return this.get<AspectPaging>({
            path: '/aspects',
            queryParams,
            returnType: AspectPaging
        });
    }
}
